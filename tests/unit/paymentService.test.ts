import { describe, it, expect, beforeEach } from "vitest";
import { paymentService } from "@/services/paymentService";
import { useDemoStore } from "@/demo/store";

describe("paymentService (demo mode)", () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemoData();
  });

  it("creates a successful demo order and records it in the store", async () => {
    const before = useDemoStore.getState().payments.length;
    const order = await paymentService.createOrder({
      purpose: "POLITIQ_VERIFIED_SUBSCRIPTION",
      amountInPaise: 99900,
      profileName: "Test User",
    });
    expect(order.status).toBe("SUCCESS");
    expect(order.orderId).toMatch(/^demo_order_/);
    expect(useDemoStore.getState().payments.length).toBe(before + 1);
  });

  it("never trusts a client-declared success without going through createOrder", async () => {
    const status = await paymentService.getOrderStatus("nonexistent_order");
    expect(status).toBe("PENDING");
  });
});
