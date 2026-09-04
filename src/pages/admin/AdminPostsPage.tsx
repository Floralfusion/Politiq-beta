import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button, EmptyState } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";

export function AdminPostsPage() {
  const posts = useDemoStore((s) => s.posts);
  return (
    <div>
      <AdminPageHeader title="Posts" description={`${posts.length} posts`} />
      {posts.length === 0 ? <EmptyState title="No posts yet." /> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-start justify-between gap-4 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-800">{p.author.fullName}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-600">{p.content}</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => toast("Post removed.", "info")}>Remove</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
