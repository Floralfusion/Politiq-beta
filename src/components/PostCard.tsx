import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Flag } from "lucide-react";
import type { Post } from "@/types";
import { Avatar, VerificationBadge, Dropdown, DropdownItem } from "@/components/ui";
import { cn, timeAgo } from "@/lib/utils";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";

export function PostCard({ post }: { post: Post }) {
  const toggleLike = useDemoStore((s) => s.toggleLike);
  const toggleSave = useDemoStore((s) => s.toggleSave);

  return (
    <article className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <Link to={`/profile/${post.author.username}`} className="flex items-start gap-3">
          <Avatar src={post.author.avatarUrl} name={post.author.fullName} size="md" />
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-navy-800 text-sm">{post.author.fullName}</p>
              {post.author.isVerified && <VerificationBadge size={13} />}
            </div>
            <p className="text-xs text-ink-500">{post.author.headline}</p>
            <p className="text-xs text-ink-400">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        <Dropdown trigger={<button aria-label="Post options" className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100"><MoreHorizontal size={18} /></button>}>
          <DropdownItem onClick={() => toast("Post reported. Our moderation team will review it.", "info")} danger>
            <Flag size={14} /> Report post
          </DropdownItem>
        </Dropdown>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-800">{post.content}</p>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-sm text-ink-500">
        <span>{post.likeCount + (post.likedByMe ? 1 : 0)} reactions</span>
        <div className="flex gap-4">
          <span>{post.commentCount} comments</span>
          <span>{post.shareCount} shares</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1 border-t border-ink-100 pt-2">
        <button
          onClick={() => toggleLike(post.id)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium hover:bg-ink-50",
            post.likedByMe ? "text-danger-500" : "text-ink-600"
          )}
        >
          <Heart size={16} fill={post.likedByMe ? "currentColor" : "none"} /> Like
        </button>
        <button
          onClick={() => toast("Comments open in the full post view.", "info")}
          className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
        >
          <MessageCircle size={16} /> Comment
        </button>
        <button
          onClick={() => toast("Share link copied.", "success")}
          className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
        >
          <Share2 size={16} /> Share
        </button>
        <button
          onClick={() => toggleSave(post.id)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium hover:bg-ink-50",
            post.savedByMe ? "text-navy-700" : "text-ink-600"
          )}
        >
          <Bookmark size={16} fill={post.savedByMe ? "currentColor" : "none"} /> Save
        </button>
      </div>
    </article>
  );
}
