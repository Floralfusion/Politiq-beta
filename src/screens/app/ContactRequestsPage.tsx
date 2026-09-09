import { useState } from "react";
import { Tabs, EmptyState, Modal, Button } from "@/components/ui";
import { ContactRequestCard } from "@/components/ContactRequestCard";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";
import { PaymentModal } from "@/components/PaymentModal";
import type { ContactRequest } from "@/types";

export function ContactRequestsPage() {
  const [tab, setTab] = useState("incoming");
  const incoming = useDemoStore((s) => s.contactRequestsIncoming);
  const outgoing = useDemoStore((s) => s.contactRequestsOutgoing);
  const respondToContactRequest = useDemoStore((s) => s.respondToContactRequest);
  const markContactPaid = useDemoStore((s) => s.markContactPaid);
  const [payingRequest, setPayingRequest] = useState<ContactRequest | null>(null);
  const [unlockedNumberModal, setUnlockedNumberModal] = useState<ContactRequest | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Contact requests</h1>
      <p className="mt-1 text-sm text-ink-600">Review requests for your contact details, or track requests you've sent.</p>

      <Tabs
        tabs={[{ id: "incoming", label: "Incoming", count: incoming.length }, { id: "outgoing", label: "Outgoing", count: outgoing.length }]}
        active={tab}
        onChange={setTab}
        className="mt-4 bg-white rounded-xl px-3 border border-ink-100"
      />

      <div className="mt-5 space-y-3">
        {tab === "incoming" && (
          incoming.length === 0 ? (
            <EmptyState title="No incoming contact requests." description="Requests from other professionals to access your contact details will appear here." />
          ) : (
            incoming.map((r) => (
              <ContactRequestCard
                key={r.id}
                request={r}
                direction="incoming"
                onApprove={() => { respondToContactRequest(r.id, true); toast("Request approved. The requester can now proceed to payment.", "success"); }}
                onDecline={() => { respondToContactRequest(r.id, false); toast("Request declined.", "info"); }}
              />
            ))
          )
        )}
        {tab === "outgoing" && (
          outgoing.length === 0 ? (
            <EmptyState title="You haven't requested contact access yet." description="Visit a profile and choose “Request Contact” to get started." />
          ) : (
            outgoing.map((r) => (
              <ContactRequestCard
                key={r.id}
                request={r}
                direction="outgoing"
                onPay={() => setPayingRequest(r)}
              />
            ))
          )
        )}
      </div>

      {payingRequest && (
        <PaymentModal
          open={!!payingRequest}
          onClose={() => setPayingRequest(null)}
          purpose="CONTACT_ACCESS"
          amountInPaise={payingRequest.feeInPaise}
          description={`Unlock contact details for ${payingRequest.recipient.fullName}`}
          onSuccess={() => {
            markContactPaid(payingRequest.id);
            setUnlockedNumberModal(payingRequest);
            setPayingRequest(null);
          }}
        />
      )}

      <Modal open={!!unlockedNumberModal} onClose={() => setUnlockedNumberModal(null)} title="Contact unlocked">
        {unlockedNumberModal && (
          <div className="space-y-2 text-sm text-ink-700">
            <p>Payment confirmed. Here is the permitted contact information for {unlockedNumberModal.recipient.fullName}:</p>
            <div className="rounded-lg bg-ink-50 p-3 font-mono text-xs">
              contact@{unlockedNumberModal.recipient.username}.politiq.example (demo contact — server returns real data only after authorization checks pass)
            </div>
            <Button className="w-full mt-2" onClick={() => setUnlockedNumberModal(null)}>Done</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
