import { Link } from "react-router-dom";
import { Users, Lock, Globe } from "lucide-react";
import type { Group } from "@/types";
import { Button, Badge } from "@/components/ui";
import { useDemoStore } from "@/demo/store";

export function GroupCard({ group }: { group: Group }) {
  const toggleGroupMembership = useDemoStore((s) => s.toggleGroupMembership);
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <Link to={`/groups/${group.id}`}>
        <p className="font-semibold text-navy-800">{group.name}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink-600">{group.description}</p>
      </Link>
      <div className="mt-3 flex items-center gap-2">
        <Badge tone="neutral"><Users size={11} className="mr-0.5" /> {group.memberCount.toLocaleString()} members</Badge>
        <Badge tone={group.privacy === "PRIVATE" ? "warning" : "success"}>
          {group.privacy === "PRIVATE" ? <Lock size={11} className="mr-0.5" /> : <Globe size={11} className="mr-0.5" />}
          {group.privacy === "PRIVATE" ? "Private" : "Public"}
        </Badge>
      </div>
      <Button
        size="sm"
        variant={group.isMember ? "secondary" : "primary"}
        className="mt-4 w-full"
        onClick={() => toggleGroupMembership(group.id)}
      >
        {group.isMember ? "Leave group" : "Join group"}
      </Button>
    </div>
  );
}
