import { EmptyState } from "@/components/ui";
import { PostCard } from "@/components/PostCard";
import { useDemoStore } from "@/demo/store";

export function BookmarksPage() {
  const posts = useDemoStore((s) => s.posts.filter((p) => p.savedByMe));
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-800">Bookmarks</h1>
      <p className="mt-1 text-sm text-ink-600">Posts you've saved to revisit later.</p>
      <div className="mt-6 space-y-4">
        {posts.length === 0 ? <EmptyState title="No bookmarks yet." description="Save posts from your feed to find them here." /> : posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
