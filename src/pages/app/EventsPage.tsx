import { useState } from "react";
import { SearchBar, EmptyState } from "@/components/ui";
import { EventCard } from "@/components/EventCard";
import { useDemoStore } from "@/demo/store";

export function EventsPage() {
  const events = useDemoStore((s) => s.events);
  const [query, setQuery] = useState("");
  const filtered = events.filter((e) => `${e.title} ${e.location}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Events</h1>
      <p className="mt-1 text-sm text-ink-600">Discover forums, summits and workshops relevant to your work.</p>
      <SearchBar value={query} onChange={setQuery} placeholder="Search events" className="mt-5" />
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? <EmptyState title="No events found." /> : filtered.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
}
