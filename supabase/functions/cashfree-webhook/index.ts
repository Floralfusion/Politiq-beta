// Supabase Edge Function: cashfree-webhook
//
// Receives server-to-server payment confirmation from Cashfree. This is the ONLY place a payment
// is ever marked SUCCESS and the ONLY place contact access is unlocked / a subscription activated.
// The client's browser is never trusted to declare "payment succeeded".
//
// Configure this URL in the Cashfree Dashboard (Developers > Webhooks):
//   https://<project-ref>.supabase.co/functions/v1/cashfree-webhook
// Deploy: supabase functions deploy cashfree-webhook --no-verify-jwt
//   (must be --no-verify-jwt because Cashfree calls this directly, not with a Supabase user JWT —
//   authenticity is instead verified via the Cashfree webhook signature below.)

import { createClient } from "jsr:@supabase/supabase-js@2";

const CASHFREE_WEBHOOK_SECRET = Deno.env.get("CASHFREE_WEBHOOK_SECRET")!; // Cashfree's client secret, used as the HMAC key for x-webhook-signature
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function verifySignature(rawBody: string, timestamp: string, signature: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(CASHFREE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signedPayload = timestamp + rawBody;
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
  return computed === signature;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature") ?? "";
    const timestamp = req.headers.get("x-webhook-timestamp") ?? "";

    const valid = await verifySignature(rawBody, timestamp, signature);
    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = req.headers.get("x-webhook-idempotency-key") ?? payload?.data?.order?.order_id + ":" + payload?.type;
    const orderId: string = payload?.data?.order?.order_id;
    const paymentStatus: string = payload?.data?.payment?.payment_status; // e.g. "SUCCESS", "FAILED"

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Idempotency: Cashfree may retry the same webhook. Recording provider_event_id with a
    // unique constraint means a duplicate delivery safely no-ops on the second insert.
    const { error: dupeErr } = await supabase.from("payment_events").insert({
      provider_event_id: eventId,
      raw_payload: payload,
    });
    if (dupeErr && dupeErr.code === "23505") {
      // Already processed this exact event — acknowledge and stop, do not re-run side effects.
      return new Response("OK (duplicate, already processed)", { status: 200 });
    }

    const { data: payment } = await supabase.from("payments").select("*").eq("order_id", orderId).single();
    if (!payment) return new Response("Unknown order", { status: 404 });

    if (paymentStatus === "SUCCESS") {
      await supabase.from("payments").update({ status: "SUCCESS", updated_at: new Date().toISOString() }).eq("id", payment.id);

      if (payment.purpose === "CONTACT_ACCESS" && payment.contact_request_id) {
        await supabase.from("contact_requests").update({ status: "CONTACT_UNLOCKED" }).eq("id", payment.contact_request_id);
        await supabase.from("contact_access").insert({ contact_request_id: payment.contact_request_id });
      }

      if (payment.purpose === "POLITIQ_VERIFIED_SUBSCRIPTION") {
        const renewsAt = new Date();
        renewsAt.setMonth(renewsAt.getMonth() + 1);
        await supabase.from("subscriptions").insert({
          profile_id: payment.profile_id,
          plan: "POLITIQ_VERIFIED",
          status: "ACTIVE",
          renews_at: renewsAt.toISOString(),
          price_in_paise: payment.amount_in_paise,
        });
      }
    } else if (paymentStatus === "FAILED") {
      await supabase.from("payments").update({ status: "FAILED", updated_at: new Date().toISOString() }).eq("id", payment.id);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error", details: String(err) }), { status: 500 });
  }
});
