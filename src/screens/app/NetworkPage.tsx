import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, Avatar, Button, VerificationBadge, EmptyState } from "@/components/ui";
import { ConnectionRequestCard } from "@/components/ConnectionCard";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";

const tabs = [
  { id: "connections", label: "Connections" },
  { id: "following", label: "Following" },
  { id: "requests", label: "Requests" },
];

export function NetworkPage() {
  const [tab, setTab] = useState("connections");
  const profiles = useDemoStore((s) => s.profiles);
  const connectionRequests = useDemoStore((s) => s.connectionRequests);
  const cancelOutgoingConnection = useDemoStore((s) => s.cancelOutgoingConnection);
  const toggleFollow = useDemoStore((s) => s.toggleFollow);

  const connections = profiles.filter((p) => p.connectionStatus === "CONNECTED");
  const following = profiles.filter((p) => p.isFollowing);
  const incoming = connectionRequests.filter((r) => r.status === "PENDING");
  const outgoing = profiles.filter((p) => p.connectionStatus === "PENDING_OUTGOING");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Your network</h1>
      <Tabs
        tabs={[
          { ...tabs[0], count: connections.length },
          { ...tabs[1], count: following.length },
          { ...tabs[2], count: incoming.length + outgoing.length },
        ]}
        active={tab}
        onChange={setTab}
        className="mt-4 bg-white rounded-xl px-3 border border-ink-100"
      />

      <div className="mt-5 space-y-3">
        {tab === "connections" && (
          connections.length === 0 ? (
            <EmptyState title="Your professional network starts here." description="Connect with professionals to grow your network." />
          ) : (
            connections.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                <Link to={`/profile/${p.username}`}><Avatar src={p.avatarUrl} name={p.fullName} size="md" /></Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <Link to={`/profile/${p.username}`} className="truncate text-sm font-semibold text-navy-800 hover:underline">{p.fullName}</Link>
                    {p.isVerified && <VerificationBadge size={12} />}
                  </div>
                  <p className="truncate text-xs text-ink-500">{p.headline}</p>
                </div>
                <Link to="/messages"><Button size="sm" variant="secondary">Message</Button></Link>
              </div>
            ))
          )
        )}

        {tab === "following" && (
          following.length === 0 ? (
            <EmptyState title="You're not following anyone yet." description="Follow professionals and organisations to see their updates in your feed." />
          ) : (
            following.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                <Link to={`/profile/${p.username}`}><Avatar src={p.avatarUrl} name={p.fullName} size="md" /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/profile/${p.username}`} className="truncate text-sm font-semibold text-navy-800 hover:underline">{p.fullName}</Link>
                  <p className="truncate text-xs text-ink-500">{p.headline}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => toggleFollow(p.id)}>Unfollow</Button>
              </div>
            ))
          )
        )}

        {tab === "requests" && (
          incoming.length === 0 && outgoing.length === 0 ? (
            <EmptyState title="No pending requests." description="Connection requests you send or receive will appear here." />
          ) : (
            <>
              {incoming.map((r) => <ConnectionRequestCard key={r.id} request={r} />)}
              {outgoing.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                  <Avatar src={p.avatarUrl} name={p.fullName} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-800">{p.fullName}</p>
                    <p className="truncate text-xs text-ink-500">Request pending</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => { cancelOutgoingConnection(p.id); toast("Connection request cancelled.", "info"); }}>Cancel</Button>
                </div>
              ))}
            </>
          )
        )}
      </div>
    </div>
  );
}
