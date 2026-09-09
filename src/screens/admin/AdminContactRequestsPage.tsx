import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge, EmptyState } from "@/components/ui";
import { formatINR, timeAgo } from "@/lib/utils";
import { useDemoStore } from "@/demo/store";

const statusTone: Record<string, "navy" | "success" | "warning" | "danger" | "neutral"> = {
  REQUESTED: "warning", APPROVED: "navy", DECLINED: "danger", EXPIRED: "neutral",
  CANCELLED: "neutral", PAYMENT_PENDING: "warning", PAID: "navy", CONTACT_UNLOCKED: "success",
};

export function AdminContactRequestsPage() {
  const incoming = useDemoStore((s) => s.contactRequestsIncoming);
  const outgoing = useDemoStore((s) => s.contactRequestsOutgoing);
  const all = [...incoming, ...outgoing];

  return (
    <div>
      <AdminPageHeader title="Contact requests" description={`${all.length} total requests`} />
      {all.length === 0 ? <EmptyState title="No contact requests." /> : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 text-left text-xs text-ink-500">
              <tr><th className="px-4 py-3 font-medium">Recipient</th><th className="px-4 py-3 font-medium">Fee</th><th className="px-4 py-3 font-medium">Requested</th><th className="px-4 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {all.map((r) => (
                <tr key={r.id} className="hover:bg-ink-50">
                  <td className="px-4 py-3 font-medium text-navy-800">{r.recipient.fullName}</td>
                  <td className="px-4 py-3 text-ink-600">{formatINR(r.feeInPaise)}</td>
                  <td className="px-4 py-3 text-ink-600">{timeAgo(r.createdAt)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[r.status]}>{r.status.replaceAll("_", " ")}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
