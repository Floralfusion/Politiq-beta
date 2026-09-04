import { useMemo, useState } from "react";
import { SearchBar, EmptyState, Badge } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import { jobs as seedJobs } from "@/demo/seedData";

const categories = ["All", "Campaign", "Research", "Consulting", "Media"];

export function JobsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return seedJobs.filter((j) => {
      if (category !== "All" && j.category !== category) return false;
      if (query && !`${j.title} ${j.organisationName} ${j.location}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, category]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Jobs in politics &amp; public life</h1>
      <p className="mt-1 text-sm text-ink-600">Browse roles across campaigns, research, consulting and media.</p>

      <SearchBar value={query} onChange={setQuery} placeholder="Search jobs by title, organisation or location" className="mt-5" />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)}>
            <Badge tone={category === c ? "navy" : "neutral"}>{c}</Badge>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState title="No jobs match your search." description="Try a different keyword or category." />
        ) : (
          filtered.map((j) => <JobCard key={j.id} job={j} />)
        )}
      </div>
    </div>
  );
}
