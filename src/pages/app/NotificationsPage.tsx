import { Button, EmptyState } from "@/components/ui";
import { NotificationListItem } from "@/components/NotificationListItem";
import { useDemoStore } from "@/demo/store";

export function NotificationsPage() {
  const notifications = useDemoStore((s) => s.notifications);
  const markNotificationRead = useDemoStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useDemoStore((s) => s.markAllNotificationsRead);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-navy-800">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>Mark all as read</Button>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-ink-100 bg-white shadow-card overflow-hidden divide-y divide-ink-100">
        {notifications.length === 0 ? (
          <EmptyState title="No notifications yet." description="Updates about your network, messages and requests will appear here." />
        ) : (
          notifications.map((n) => <NotificationListItem key={n.id} notification={n} onClick={() => markNotificationRead(n.id)} />)
        )}
      </div>
    </div>
  );
}
