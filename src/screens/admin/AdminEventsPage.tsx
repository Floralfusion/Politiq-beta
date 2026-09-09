import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useDemoStore } from "@/demo/store";

export function AdminEventsPage() {
  const events = useDemoStore((s) => s.events);
  return (
    <div>
      <AdminPageHeader title="Events" description={`${events.length} events`} />
      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
            <p className="text-sm font-medium text-navy-800">{e.title}</p>
            <p className="text-xs text-ink-500">{e.date} • {e.location} • {e.attendeeCount} attending</p>
          </div>
        ))}
      </div>
    </div>
  );
}
