import { EmptyState } from "@/components/ui";

export function SavedSearchesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Saved searches</h1>
      <p className="mt-1 text-sm text-ink-600">Save Discover filters to quickly return to them.</p>
      <div className="mt-6">
        <EmptyState title="No saved searches yet." description="Apply filters on Discover and save them for quick access." />
      </div>
    </div>
  );
}
