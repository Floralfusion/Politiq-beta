import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge, EmptyState } from "@/components/ui";
import { formatINR } from "@/lib/utils";
import { useDemoStore } from "@/demo/store";
import { profiles } from "@/demo/seedData";

export function AdminSubscriptionsPage() {
  const subscriptions = useDemoStore((s) => s.subscriptions);
  return (
    <div>
      <AdminPageHeader title="Subscriptions" description="POLITIQ Verified subscribers." />
      {subscriptions.length === 0 ? <EmptyState title="No subscriptions yet." /> : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 text-left text-xs text-ink-500">
              <tr><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Price</th><th className="px-4 py-3 font-medium">Renews</th><th className="px-4 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {subscriptions.map((s) => {
                const p = profiles.find((pr) => pr.id === s.profileId);
                return (
                  <tr key={s.id} className="hover:bg-ink-50">
                    <td className="px-4 py-3 font-medium text-navy-800">{p?.fullName ?? s.profileId}</td>
                    <td className="px-4 py-3 text-ink-600">POLITIQ Verified</td>
                    <td className="px-4 py-3 text-ink-700">{formatINR(s.priceInPaise)}/mo</td>
                    <td className="px-4 py-3 text-ink-500">{s.renewsAt}</td>
                    <td className="px-4 py-3"><Badge tone="success">{s.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
