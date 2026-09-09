import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchBar, Button, Badge, Skeleton, EmptyState, Pagination, BottomSheet } from "@/components/ui";
import { ProfileCard } from "@/components/ProfileCard";
import { useDemoStore } from "@/demo/store";
import type { ProfessionalCategory } from "@/types";

const categories: ProfessionalCategory[] = [
  "Political Professional", "Political Staff", "Campaign Professional", "Political Consultant",
  "Party Professional", "Public Affairs", "Policy Professional", "Journalist", "Researcher", "Organisation",
];

const PAGE_SIZE = 9;

export function DiscoverPage() {
  const [params, setParams] = useSearchParams();
  const profiles = useDemoStore((s) => s.profiles);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const loading = query !== debouncedQuery;

  // Debounced, simulated server-side search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
      setParams(query ? { q: query } : {}, { replace: true });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const updateCategory = (c: string) => {
    setCategory(c);
    setPage(1);
  };
  const updateVerifiedOnly = (v: boolean) => {
    setVerifiedOnly(v);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return profiles.filter((p) => {
      if (q) {
        const haystack = `${p.fullName} ${p.headline} ${p.organisationName ?? ""} ${p.location} ${p.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category && p.category !== category) return false;
      if (verifiedOnly && !p.isVerified) return false;
      return true;
    });
  }, [profiles, debouncedQuery, category, verifiedOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filtersContent = (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium text-ink-500">Category</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => updateCategory("")} className={`rounded-full px-3 py-1 text-xs font-medium border ${category === "" ? "border-navy-700 bg-navy-700 text-white" : "border-ink-200 text-ink-600"}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => updateCategory(c)} className={`rounded-full px-3 py-1 text-xs font-medium border ${category === c ? "border-navy-700 bg-navy-700 text-white" : "border-ink-200 text-ink-600"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" checked={verifiedOnly} onChange={(e) => updateVerifiedOnly(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-navy-700 focus:ring-navy-500" />
        Verified profiles only
      </label>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Find the right person.</h1>
      <p className="mt-1 text-sm text-ink-600">Search across people, organisations and expertise in politics and public life.</p>

      <div className="mt-5 flex gap-2">
        <SearchBar value={query} onChange={setQuery} placeholder="Search people, organisations or expertise" />
        <Button variant="secondary" className="sm:hidden shrink-0" onClick={() => setFilterSheetOpen(true)} aria-label="Filters">
          <SlidersHorizontal size={16} />
        </Button>
      </div>

      <div className="mt-5 hidden sm:block rounded-xl border border-ink-100 bg-white p-4">{filtersContent}</div>

      <BottomSheet open={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} title="Filters">
        {filtersContent}
        <Button className="mt-5 w-full" onClick={() => setFilterSheetOpen(false)}>Show results</Button>
      </BottomSheet>

      {(category || verifiedOnly) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {category && <Badge tone="navy">{category} <button onClick={() => updateCategory("")} aria-label="Clear category"><X size={11} /></button></Badge>}
          {verifiedOnly && <Badge tone="success">Verified only <button onClick={() => updateVerifiedOnly(false)} aria-label="Clear verified filter"><X size={11} /></button></Badge>}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        ) : paged.length === 0 ? (
          <EmptyState title="We couldn't find the right person yet." description="Try a different search term or adjust your filters." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((p) => <ProfileCard key={p.id} profile={p} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
