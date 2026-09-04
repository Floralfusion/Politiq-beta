import { Link } from "react-router-dom";
import type { ConnectionRequest } from "@/types";
import { Avatar, Button, VerificationBadge } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";

export function ConnectionRequestCard({ request }: { request: ConnectionRequest }) {
  const respond = useDemoStore((s) => s.respondToConnectionRequest);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
      <Link to={`/profile/${request.fromProfile.username}`}>
        <Avatar src={request.fromProfile.avatarUrl} name={request.fromProfile.fullName} size="md" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Link to={`/profile/${request.fromProfile.username}`} className="truncate font-semibold text-navy-800 text-sm hover:underline">
            {request.fromProfile.fullName}
          </Link>
          {request.fromProfile.isVerified && <VerificationBadge size={12} />}
        </div>
        <p className="truncate text-xs text-ink-500">{request.fromProfile.headline}</p>
        <p className="text-xs text-ink-400">{timeAgo(request.createdAt)}</p>
      </div>
      {request.status === "PENDING" ? (
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            onClick={() => {
              respond(request.id, true);
              toast(`You're now connected with ${request.fromProfile.fullName}.`, "success");
            }}
          >
            Accept
          </Button>
          <Button size="sm" variant="secondary" onClick={() => respond(request.id, false)}>
            Decline
          </Button>
        </div>
      ) : (
        <span className="shrink-0 text-xs font-medium text-ink-400">{request.status === "ACCEPTED" ? "Accepted" : "Declined"}</span>
      )}
    </div>
  );
}
