import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui";
import { useDemoStore } from "@/demo/store";

export function AdminGroupsPage() {
  const groups = useDemoStore((s) => s.groups);
  return (
    <div>
      <AdminPageHeader title="Groups" description={`${groups.length} groups`} />
      <div className="space-y-3">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center justify-between gap-4 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
            <div>
              <p className="text-sm font-medium text-navy-800">{g.name}</p>
              <p className="text-xs text-ink-500">{g.memberCount.toLocaleString()} members</p>
            </div>
            <Badge tone={g.privacy === "PRIVATE" ? "warning" : "success"}>{g.privacy}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
