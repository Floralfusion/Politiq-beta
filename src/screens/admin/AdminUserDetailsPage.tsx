import { useParams } from "react-router-dom";
import { Avatar, Badge, VerificationBadge, Button, EmptyState } from "@/components/ui";
import { profiles } from "@/demo/seedData";
import { toast } from "@/components/ui/Toast";

export function AdminUserDetailsPage() {
  const { userId } = useParams();
  const user = profiles.find((p) => p.id === userId);
  if (!user) return <EmptyState title="User not found" />;

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatarUrl} name={user.fullName} size="lg" />
          <div>
            <p className="flex items-center gap-1.5 text-lg font-semibold text-navy-800">{user.fullName} {user.isVerified && <VerificationBadge size={16} />}</p>
            <p className="text-sm text-ink-500">{user.headline}</p>
          </div>
          <Badge tone={user.isVerified ? "success" : "neutral"} className="ml-auto">{user.isVerified ? "Verified" : "Unverified"}</Badge>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-ink-400">Username</dt><dd className="text-ink-700">@{user.username}</dd></div>
          <div><dt className="text-ink-400">Category</dt><dd className="text-ink-700">{user.category}</dd></div>
          <div><dt className="text-ink-400">Location</dt><dd className="text-ink-700">{user.location}</dd></div>
          <div><dt className="text-ink-400">Organisation</dt><dd className="text-ink-700">{user.organisationName ?? "—"}</dd></div>
          <div><dt className="text-ink-400">Connections</dt><dd className="text-ink-700">{user.connectionsCount}</dd></div>
          <div><dt className="text-ink-400">Member since</dt><dd className="text-ink-700">{user.memberSince}</dd></div>
        </dl>
        <div className="mt-6 flex gap-2 border-t border-ink-100 pt-4">
          <Button variant="secondary" size="sm" onClick={() => toast("User suspended.", "info")}>Suspend</Button>
          <Button variant="danger" size="sm" onClick={() => toast("User banned.", "error")}>Ban</Button>
        </div>
      </div>
    </div>
  );
}
