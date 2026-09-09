import { useParams } from "react-router-dom";
import { Users, Lock, Globe, Flag } from "lucide-react";
import { Button, Badge, EmptyState, Tabs } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { useState } from "react";
import { toast } from "@/components/ui/Toast";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const groups = useDemoStore((s) => s.groups);
  const toggleGroupMembership = useDemoStore((s) => s.toggleGroupMembership);
  const submitReport = useDemoStore((s) => s.submitReport);
  const [tab, setTab] = useState("discussions");
  const group = groups.find((g) => g.id === groupId);

  if (!group) return <EmptyState title="Group not found" />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-navy-800">{group.name}</h1>
            <p className="mt-1 text-sm text-ink-600">{group.description}</p>
          </div>
          <Button
            size="sm"
            variant={group.isMember ? "secondary" : "primary"}
            onClick={() => toggleGroupMembership(group.id)}
          >
            {group.isMember ? "Leave" : "Join"}
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="neutral"><Users size={11} className="mr-0.5" /> {group.memberCount.toLocaleString()} members</Badge>
          <Badge tone={group.privacy === "PRIVATE" ? "warning" : "success"}>
            {group.privacy === "PRIVATE" ? <Lock size={11} className="mr-0.5" /> : <Globe size={11} className="mr-0.5" />}
            {group.privacy === "PRIVATE" ? "Private" : "Public"}
          </Badge>
          <button onClick={() => { submitReport({ targetType: "GROUP", targetId: group.id, targetLabel: group.name, category: "Other" }); toast("Group reported.", "info"); }} className="ml-auto text-xs text-ink-400 hover:text-danger-500 flex items-center gap-1">
            <Flag size={12} /> Report
          </button>
        </div>
      </div>

      <Tabs tabs={[{ id: "discussions", label: "Discussions" }, { id: "members", label: "Members" }]} active={tab} onChange={setTab} className="mt-5 bg-white rounded-xl px-3 border border-ink-100" />

      <div className="mt-5">
        {tab === "discussions" ? (
          group.isMember ? (
            <EmptyState title="No discussions yet." description="Be the first to start a conversation in this group." />
          ) : (
            <EmptyState title="Join this group to see discussions." actionLabel="Join group" onAction={() => toggleGroupMembership(group.id)} />
          )
        ) : (
          <EmptyState title="Member list is private." description="Only group moderators can view the full member list in Beta." />
        )}
      </div>
    </div>
  );
}
