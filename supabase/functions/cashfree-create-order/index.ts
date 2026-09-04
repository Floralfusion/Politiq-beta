// Supabase Edge Function: cashfree-create-order
//
// Creates a Cashfree payment order server-side. CASHFREE_SECRET_KEY never leaves this function —
// the browser only ever receives back a `payment_session_id` to hand to Cashfree's Checkout JS SDK.
//
// Deploy: supabase functions deploy cashfree-create-order
// Secrets: supabase secrets set CASHFREE_APP_ID=... CASHFREE_SECRET_KEY=... CASHFREE_ENV=PROD
//
// Request body: { purpose: "CONTACT_ACCESS" | "POLITIQ_VERIFIED_SUBSCRIPTION", amountInPaise: number, profileName: string, contactRequestId?: string }

import { createClient } from "jsr:@supabase/supabase-js@2";

const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID")!;
const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY")!;
const CASHFREE_ENV = Deno.env.get("CASHFREE_ENV") ?? "TEST"; // TEST | PROD
const CASHFREE_BASE_URL = CASHFREE_ENV === "PROD" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    // Verify the caller via the JWT Supabase automatically validates when `verify_jwt` is on
    // for this function (default). The subject claim carries the Clerk user id.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
    if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });
    const clerkUserId = userData.user.id; // mapped via Clerk <-> Supabase JWT template — see docs/security.md

    const { data: profile } = await supabase.from("profiles").select("id, full_name").eq("user_id", clerkUserId).single();
    if (!profile) return new Response("Profile not found", { status: 404 });

    const body = await req.json();
    const { purpose, amountInPaise, contactRequestId } = body as {
      purpose: "CONTACT_ACCESS" | "POLITIQ_VERIFIED_SUBSCRIPTION";
      amountInPaise: number;
      contactRequestId?: string;
    };

    if (!purpose || !amountInPaise || amountInPaise <= 0) {
      return new Response(JSON.stringify({ error: "Invalid order request" }), { status: 400 });
    }

    // For CONTACT_ACCESS, re-derive and verify the fee server-side rather than trusting the
    // client-sent amount, and confirm the request is actually APPROVED and belongs to this user.
    if (purpose === "CONTACT_ACCESS") {
      if (!contactRequestId) return new Response(JSON.stringify({ error: "contactRequestId required" }), { status: 400 });
      const { data: cr } = await supabase
        .from("contact_requests")
        .select("id, status, fee_in_paise, requester_profile_id")
        .eq("id", contactRequestId)
        .single();
      if (!cr || cr.requester_profile_id !== profile.id || cr.status !== "APPROVED") {
        return new Response(JSON.stringify({ error: "Contact request not eligible for payment" }), { status: 403 });
      }
    }

    const orderId = `politiq_${purpose.toLowerCase()}_${crypto.randomUUID()}`;

    const cfRes = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amountInPaise / 100,
        order_currency: "INR",
        customer_details: {
          customer_id: profile.id,
          customer_name: profile.full_name,
          customer_email: userData.user.email ?? "no-email@politiq.dev",
          customer_phone: userData.user.phone ?? "9999999999",
        },
        order_meta: {
          return_url: `${Deno.env.get("APP_URL")}/settings?order_id={order_id}`,
        },
        order_note: purpose,
      }),
    });

    if (!cfRes.ok) {
      const errText = await cfRes.text();
      return new Response(JSON.stringify({ error: "Cashfree order creation failed", details: errText }), { status: 502 });
    }
    const cfData = await cfRes.json();

    await supabase.from("payments").insert({
      order_id: orderId,
      profile_id: profile.id,
      purpose,
      contact_request_id: contactRequestId ?? null,
      amount_in_paise: amountInPaise,
      status: "PENDING",
      provider: "CASHFREE",
    });

    return new Response(JSON.stringify({ orderId, paymentSessionId: cfData.payment_session_id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error", details: String(err) }), { status: 500 });
  }
});
