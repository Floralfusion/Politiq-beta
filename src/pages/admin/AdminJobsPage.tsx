import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui";
import { jobs } from "@/demo/seedData";
import { toast } from "@/components/ui/Toast";

export function AdminJobsPage() {
  return (
    <div>
      <AdminPageHeader title="Jobs" description={`${jobs.length} postings`} action={<Button size="sm" onClick={() => toast("Job creation form coming in a future iteration.", "info")}>New job</Button>} />
      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="flex items-center justify-between gap-4 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
            <div>
              <p className="text-sm font-medium text-navy-800">{j.title}</p>
              <p className="text-xs text-ink-500">{j.organisationName} • {j.location}</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => toast("Job posting removed.", "info")}>Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
