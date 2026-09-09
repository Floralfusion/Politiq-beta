import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge, EmptyState } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { profiles } from "@/demo/seedData";

const statusTone: Record<string, "neutral" | "warning" | "success" | "danger"> = {
  NOT_STARTED: "neutral", DRAFT: "neutral", SUBMITTED: "warning", UNDER_REVIEW: "warning",
  VERIFIED: "success", REJECTED: "danger", NEEDS_MORE_INFORMATION: "warning", EXPIRED: "neutral",
};

export function AdminVerificationsPage() {
  const requests = useDemoStore((s) => s.verificationRequests);
  const pending = requests.filter((r) => r.status === "UNDER_REVIEW" || r.status === "SUBMITTED");
  const user = profiles[0];

  return (
    <div>
      <AdminPageHeader title="Verification queue" description={`${pending.length} awaiting review`} />
      {pending.length === 0 ? (
        <EmptyState title="Queue is clear." description="No verification requests are currently pending review." />
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <Link key={r.id} to={`/admin/verifications/${r.id}`} className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-4 shadow-card hover:border-navy-200">
              <div>
                <p className="font-medium text-navy-800 text-sm">{user.fullName} — {r.type.charAt(0) + r.type.slice(1).toLowerCase()}</p>
                <p className="text-xs text-ink-500">Submitted {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("en-IN") : "—"}</p>
              </div>
              <Badge tone={statusTone[r.status]}>{r.status.replaceAll("_", " ")}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
