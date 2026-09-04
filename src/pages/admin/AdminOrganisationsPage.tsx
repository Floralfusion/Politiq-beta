import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge, VerificationBadge } from "@/components/ui";
import { organisations } from "@/demo/seedData";

export function AdminOrganisationsPage() {
  return (
    <div>
      <AdminPageHeader title="Organisations" description={`${organisations.length} organisations`} />
      <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 text-left text-xs text-ink-500">
            <tr><th className="px-4 py-3 font-medium">Organisation</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Members</th><th className="px-4 py-3 font-medium">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {organisations.map((o) => (
              <tr key={o.id} className="hover:bg-ink-50">
                <td className="px-4 py-3 font-medium text-navy-800 flex items-center gap-1.5">{o.name} {o.isVerified && <VerificationBadge size={12} />}</td>
                <td className="px-4 py-3 text-ink-600">{o.category}</td>
                <td className="px-4 py-3 text-ink-600">{o.memberCount.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge tone={o.isVerified ? "success" : "neutral"}>{o.isVerified ? "Verified" : "Unverified"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
