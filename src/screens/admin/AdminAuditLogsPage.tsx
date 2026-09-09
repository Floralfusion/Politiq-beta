import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { timeAgo } from "@/lib/utils";
import { auditLogs } from "@/demo/seedData";

export function AdminAuditLogsPage() {
  return (
    <div>
      <AdminPageHeader title="Audit logs" description="Every moderation and admin action is recorded here." />
      <div className="rounded-xl border border-ink-100 bg-white shadow-card divide-y divide-ink-100">
        {auditLogs.map((l) => (
          <div key={l.id} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-800"><span className="font-medium text-navy-800">{l.actorName}</span> {l.action.toLowerCase()} — {l.targetLabel}</p>
            </div>
            <p className="text-xs text-ink-400 shrink-0 ml-4">{timeAgo(l.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
