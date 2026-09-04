import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { Profile } from "@/types";
import { Avatar, Badge, Button, VerificationBadge } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";

export function ProfileCard({ profile }: { profile: Profile }) {
  const sendConnectionRequest = useDemoStore((s) => s.sendConnectionRequest);
  const toggleFollow = useDemoStore((s) => s.toggleFollow);

  return (
    <div className="flex flex-col rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <Link to={`/profile/${profile.username}`} className="flex items-start gap-3">
        <Avatar src={profile.avatarUrl} name={profile.fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate font-semibold text-navy-800">{profile.fullName}</p>
            {profile.isVerified && <VerificationBadge size={14} />}
          </div>
          <p className="truncate text-sm text-ink-600">{profile.headline}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
            <MapPin size={12} /> {profile.location}
          </p>
        </div>
      </Link>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge tone="navy">{profile.category}</Badge>
        {profile.organisationName && <Badge tone="neutral">{profile.organisationName}</Badge>}
      </div>
      <div className="mt-4 flex gap-2">
        {profile.connectionStatus === "CONNECTED" ? (
          <Button size="sm" variant="secondary" className="flex-1" disabled>
            Connected
          </Button>
        ) : profile.connectionStatus === "PENDING_OUTGOING" ? (
          <Button size="sm" variant="secondary" className="flex-1" disabled>
            Request sent
          </Button>
        ) : (
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            onClick={() => {
              sendConnectionRequest(profile.id);
              toast(`Connection request sent to ${profile.fullName}`, "success");
            }}
          >
            Connect
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={() => toggleFollow(profile.id)}
        >
          {profile.isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
}
