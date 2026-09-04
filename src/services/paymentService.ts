import { PAYMENTS_DEMO_MODE, DEMO_MODE, SUPABASE_URL } from "@/constants/config";
import { useDemoStore } from "@/demo/store";
import type { PaymentRecord } from "@/types";

export interface CreateOrderInput {
  purpose: PaymentRecord["purpose"];
  amountInPaise: number;
  profileName: string;
}

export interface OrderResult {
  orderId: string;
  status: "SUCCESS" | "PENDING";
}

/**
 * Payment flow (Cashfree), demo-mode-aware.
 *
 * LIVE MODE (once CASHFREE_APP_ID / CASHFREE_SECRET_KEY are set and VITE_PAYMENTS_DEMO_MODE=false):
 *   1. Client calls the `cashfree-create-order` Supabase Edge Function (server-side — never exposes
 *      CASHFREE_SECRET_KEY to the browser). It creates a Cashfree order and returns a `payment_session_id`.
 *   2. Client launches Cashfree's Checkout JS SDK with that session id.
 *   3. Cashfree redirects back and ALSO calls the `cashfree-webhook` Edge Function server-to-server.
 *   4. The webhook verifies the signature, marks the order PAID in Postgres, and unlocks the resource
 *      (contact access / subscription). The client never sets payment success itself — it only polls
 *      `getOrderStatus` and reflects whatever the server has recorded.
 *   See supabase/functions/cashfree-create-order and supabase/functions/cashfree-webhook.
 *
 * DEMO MODE:
 *   Simulates the same shape (create order -> "processing" -> resolved status) using local state so
 *   the full contact-access and subscription UX is explorable with zero external credentials, and is
 *   clearly labelled as a demo transaction everywhere it appears (never presented as a real charge).
 */
export const paymentService = {
  async createOrder(input: CreateOrderInput): Promise<OrderResult> {
    if (DEMO_MODE || PAYMENTS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 900));
      const record = useDemoStore.getState().createPayment({
        orderId: `demo_order_${Date.now()}`,
        purpose: input.purpose,
        amountInPaise: input.amountInPaise,
        status: "SUCCESS",
        provider: "CASHFREE",
        profileName: input.profileName,
      });
      return { orderId: record.orderId, status: "SUCCESS" };
    }

    // Live path — calls the Edge Function; never talks to Cashfree directly from the browser.
    const res = await fetch(`${SUPABASE_URL}/functions/v1/cashfree-create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create payment order.");
    const data = await res.json();
    return { orderId: data.orderId, status: "PENDING" };
  },

  async getOrderStatus(orderId: string): Promise<"SUCCESS" | "PENDING" | "FAILED"> {
    if (DEMO_MODE || PAYMENTS_DEMO_MODE) {
      const rec = useDemoStore.getState().payments.find((p) => p.orderId === orderId);
      return rec?.status === "SUCCESS" ? "SUCCESS" : rec?.status === "FAILED" ? "FAILED" : "PENDING";
    }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/cashfree-order-status?orderId=${orderId}`);
    if (!res.ok) throw new Error("Failed to fetch order status.");
    const data = await res.json();
    return data.status;
  },
};
