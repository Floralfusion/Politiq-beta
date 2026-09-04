import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useDemoStore } from "@/demo/store";
import { timeAgo } from "@/lib/utils";

export function AdminNotificationsPage() {
  const notifications = useDemoStore((s) => s.notifications);
  return (
    <div>
      <AdminPageHeader title="Notifications" description="System-wide notification activity (read-only view)." />
      <div className="rounded-xl border border-ink-100 bg-white shadow-card divide-y divide-ink-100">
        {notifications.map((n) => (
          <div key={n.id} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-800">{n.title}</p>
              <p className="text-xs text-ink-500">{n.body}</p>
            </div>
            <p className="text-xs text-ink-400 shrink-0 ml-4">{timeAgo(n.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
