import { useState } from "react";
import { SearchBar, EmptyState } from "@/components/ui";
import { GroupCard } from "@/components/GroupCard";
import { useDemoStore } from "@/demo/store";

export function GroupsPage() {
  const groups = useDemoStore((s) => s.groups);
  const [query, setQuery] = useState("");
  const filtered = groups.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Groups</h1>
      <p className="mt-1 text-sm text-ink-600">Join communities of professionals working on similar issues.</p>
      <SearchBar value={query} onChange={setQuery} placeholder="Search groups" className="mt-5" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? <EmptyState title="No groups found." /> : filtered.map((g) => <GroupCard key={g.id} group={g} />)}
      </div>
    </div>
  );
}
