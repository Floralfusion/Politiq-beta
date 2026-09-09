import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge, EmptyState } from "@/components/ui";
import { formatINR, timeAgo } from "@/lib/utils";
import { useDemoStore } from "@/demo/store";

const statusTone: Record<string, "success" | "danger" | "warning" | "neutral"> = { SUCCESS: "success", FAILED: "danger", PENDING: "warning", REFUNDED: "neutral" };

export function AdminPaymentsPage() {
  const payments = useDemoStore((s) => s.payments);
  return (
    <div>
      <AdminPageHeader title="Payments" description="All Cashfree transactions processed through POLITIQ." />
      {payments.length === 0 ? <EmptyState title="No payments yet." /> : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 text-left text-xs text-ink-500">
              <tr><th className="px-4 py-3 font-medium">Order ID</th><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Purpose</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50">
                  <td className="px-4 py-3 font-mono text-xs text-ink-600">{p.orderId}</td>
                  <td className="px-4 py-3 text-ink-700">{p.profileName}</td>
                  <td className="px-4 py-3 text-ink-600">{p.purpose === "CONTACT_ACCESS" ? "Contact access" : "POLITIQ Verified"}</td>
                  <td className="px-4 py-3 text-ink-700">{formatINR(p.amountInPaise)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[p.status]}>{p.status}</Badge></td>
                  <td className="px-4 py-3 text-ink-500">{timeAgo(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
