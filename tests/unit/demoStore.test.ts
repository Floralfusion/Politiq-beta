import { describe, it, expect, beforeEach } from "vitest";
import { useDemoStore } from "@/demo/store";

describe("demo store — connection & contact flows", () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemoData();
  });

  it("moves a profile to PENDING_OUTGOING on connection request", () => {
    useDemoStore.getState().sendConnectionRequest("p-02");
    const p = useDemoStore.getState().profiles.find((p) => p.id === "p-02");
    expect(p?.connectionStatus).toBe("PENDING_OUTGOING");
  });

  it("does not unlock contact access until explicitly marked paid", () => {
    useDemoStore.getState().requestContact("p-05", "Let's talk");
    const req = useDemoStore.getState().contactRequestsOutgoing[0];
    expect(req.status).toBe("REQUESTED");
    expect(req.status).not.toBe("CONTACT_UNLOCKED");
  });

  it("marks verification UNDER_REVIEW after document submission, not VERIFIED", () => {
    useDemoStore.getState().submitVerification("ORGANISATION", "doc.pdf");
    const v = useDemoStore.getState().verificationRequests.find((v) => v.type === "ORGANISATION");
    expect(v?.status).toBe("UNDER_REVIEW");
  });
});
