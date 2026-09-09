import { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Video, Calendar as CalendarIcon, FileText, BarChart3, ShieldCheck } from "lucide-react";
import { Avatar, Button, Tabs, Textarea, EmptyState } from "@/components/ui";
import { RightSidebar } from "@/layouts/AppLayout";
import { PostCard } from "@/components/PostCard";
import { useDemoStore } from "@/demo/store";
import { useAuth } from "@/hooks/useAuth";
import { events, profiles } from "@/demo/seedData";
import { toast } from "@/components/ui/Toast";

const tabs = [
  { id: "all", label: "All Updates" },
  { id: "following", label: "Following" },
  { id: "connections", label: "Connections" },
  { id: "groups", label: "Groups" },
  { id: "organisations", label: "Organisations" },
];

export function HomePage() {
  const { user } = useAuth();
  const posts = useDemoStore((s) => s.posts);
  const createPost = useDemoStore((s) => s.createPost);
  const [tab, setTab] = useState("all");
  const [draft, setDraft] = useState("");

  const suggestions = profiles.filter((p) => p.connectionStatus === "NONE").slice(0, 3);

  const handlePost = () => {
    if (!draft.trim()) return;
    createPost(draft.trim());
    setDraft("");
    toast("Update shared with your network.", "success");
  };

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="flex gap-3">
            <Avatar src={user.avatarUrl} name={user.fullName} size="md" />
            <Textarea rows={2} placeholder="Share an update with your network..." value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
            <div className="flex flex-wrap gap-1">
              {[{ icon: Image, label: "Photo" }, { icon: Video, label: "Video" }, { icon: CalendarIcon, label: "Event" }, { icon: FileText, label: "Article" }, { icon: BarChart3, label: "Poll" }].map((a) => (
                <button key={a.label} onClick={() => toast(`${a.label} attachments are coming soon in Beta.`, "info")} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100">
                  <a.icon size={15} /> {a.label}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={handlePost} disabled={!draft.trim()}>Post</Button>
          </div>
        </div>

        <Tabs tabs={tabs} active={tab} onChange={setTab} className="bg-white rounded-xl px-3 border border-ink-100" />

        {posts.length === 0 ? (
          <EmptyState title="Your feed starts here." description="Follow professionals and organisations to see their updates." />
        ) : (
          <div className="space-y-4">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </div>

      <RightSidebar>
        {!user.isVerified && (
          <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-navy-700"><ShieldCheck size={18} /><p className="font-semibold text-sm">POLITIQ Verified</p></div>
            <p className="mt-1.5 text-xs text-ink-500">Stand out. Build trust.</p>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-600">
              {["Verified badge", "Identity verification", "Professional verification", "Higher visibility"].map((b) => (
                <li key={b} className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-success-500" /> {b}</li>
              ))}
            </ul>
            <Link to="/pricing"><Button size="sm" className="mt-4 w-full">Get Verified</Button></Link>
          </div>
        )}

        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-navy-800">Upcoming Events</p>
            <Link to="/events" className="text-xs text-navy-700 hover:underline">See all</Link>
          </div>
          <div className="space-y-3">
            {events.slice(0, 3).map((e) => (
              <Link key={e.id} to={`/events/${e.id}`} className="block">
                <p className="text-sm font-medium text-navy-800 line-clamp-1">{e.title}</p>
                <p className="text-xs text-ink-500">{e.date} • {e.location}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-navy-800">People You May Know</p>
            <Link to="/discover" className="text-xs text-navy-700 hover:underline">See all</Link>
          </div>
          <div className="space-y-3">
            {suggestions.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <Avatar src={p.avatarUrl} name={p.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                  <Link to={`/profile/${p.username}`} className="block truncate text-sm font-medium text-navy-800 hover:underline">{p.fullName}</Link>
                  <p className="truncate text-xs text-ink-500">{p.headline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RightSidebar>
    </div>
  );
}
