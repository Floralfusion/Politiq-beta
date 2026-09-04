import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge, Button, EmptyState, Tabs } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";
import { useState } from "react";
import { timeAgo } from "@/lib/utils";

const statusTone: Record<string, "warning" | "success" | "neutral"> = { OPEN: "warning", RESOLVED: "success", DISMISSED: "neutral" };

export function AdminReportsPage() {
  const reports = useDemoStore((s) => s.reports);
  const adminResolveReport = useDemoStore((s) => s.adminResolveReport);
  const [tab, setTab] = useState("OPEN");
  const filtered = reports.filter((r) => r.status === tab);

  return (
    <div>
      <AdminPageHeader title="Reports" description="Review and moderate reported content." />
      <Tabs
        tabs={[{ id: "OPEN", label: "Open" }, { id: "RESOLVED", label: "Resolved" }, { id: "DISMISSED", label: "Dismissed" }]}
        active={tab}
        onChange={setTab}
        className="mb-4 bg-white rounded-xl px-3 border border-ink-100"
      />
      {filtered.length === 0 ? <EmptyState title="Nothing here." /> : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-navy-800">{r.targetType} — {r.targetLabel}</p>
                  <p className="text-xs text-ink-500">{r.category} • {timeAgo(r.createdAt)}</p>
                  {r.details && <p className="mt-1.5 text-sm text-ink-600">{r.details}</p>}
                </div>
                <Badge tone={statusTone[r.status]}>{r.status}</Badge>
              </div>
              {r.status === "OPEN" && (
                <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
                  <Button size="sm" onClick={() => { adminResolveReport(r.id, "RESOLVED"); toast("Report resolved. Action logged.", "success"); }}>Resolve</Button>
                  <Button size="sm" variant="secondary" onClick={() => { adminResolveReport(r.id, "DISMISSED"); toast("Report dismissed.", "info"); }}>Dismiss</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
