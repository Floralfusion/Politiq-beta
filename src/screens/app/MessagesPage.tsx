import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, ShieldAlert, UserX } from "lucide-react";
import { Avatar, EmptyState, Dropdown, DropdownItem } from "@/components/ui";
import { MessageBubble } from "@/components/MessageBubble";
import { useDemoStore } from "@/demo/store";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

export function MessagesPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const conversations = useDemoStore((s) => s.conversations);
  const messages = useDemoStore((s) => s.messages);
  const sendMessage = useDemoStore((s) => s.sendMessage);
  const markConversationRead = useDemoStore((s) => s.markConversationRead);
  const [draft, setDraft] = useState("");

  const activeId = conversationId ?? conversations[0]?.id;
  const active = conversations.find((c) => c.id === activeId);
  const thread = messages.filter((m) => m.conversationId === activeId);

  useEffect(() => {
    if (activeId) markConversationRead(activeId);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (conversations.length === 0) {
    return <EmptyState title="Your conversations will appear here." description="Messaging becomes available once you connect with someone." />;
  }

  const send = () => {
    if (!draft.trim() || !activeId) return;
    sendMessage(activeId, draft.trim());
    setDraft("");
  };

  return (
    <div className="rounded-xl border border-ink-100 bg-white shadow-card overflow-hidden">
      <div className="grid sm:grid-cols-[280px_1fr] h-[calc(100vh-220px)] min-h-[420px]">
        {/* Conversation list */}
        <div className={cn("border-r border-ink-100 overflow-y-auto", conversationId ? "hidden sm:block" : "block")}>
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/messages/${c.id}`)}
              className={cn("flex w-full items-center gap-3 border-b border-ink-100 px-4 py-3.5 text-left hover:bg-ink-50", c.id === activeId && "bg-navy-50")}
            >
              <Avatar src={c.participant.avatarUrl} name={c.participant.fullName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-800">{c.participant.fullName}</p>
                <p className="truncate text-xs text-ink-500">{c.lastMessage}</p>
              </div>
              {c.unreadCount > 0 && <span className="h-2 w-2 shrink-0 rounded-full bg-navy-600" />}
            </button>
          ))}
        </div>

        {/* Thread */}
        <div className={cn("flex flex-col", conversationId ? "flex" : "hidden sm:flex")}>
          {active && (
            <>
              <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
                <button className="sm:hidden p-1 text-ink-500" onClick={() => navigate("/messages")} aria-label="Back"><ArrowLeft size={18} /></button>
                <Avatar src={active.participant.avatarUrl} name={active.participant.fullName} size="sm" />
                <p className="text-sm font-medium text-navy-800 flex-1">{active.participant.fullName}</p>
                <Dropdown trigger={<button className="p-1.5 text-ink-400 hover:bg-ink-100 rounded-md" aria-label="Conversation options">•••</button>}>
                  <DropdownItem onClick={() => toast("User blocked.", "info")}><UserX size={14} /> Block user</DropdownItem>
                  <DropdownItem onClick={() => toast("Conversation reported.", "info")} danger><ShieldAlert size={14} /> Report conversation</DropdownItem>
                </Dropdown>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {thread.map((m) => (
                  <MessageBubble key={m.id} content={m.content} mine={m.senderId !== active.participant.id} time={new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-ink-100 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Write a message..."
                  aria-label="Message"
                  className="h-10 flex-1 rounded-lg border border-ink-200 px-3 text-sm outline-none focus:border-navy-500"
                />
                <button onClick={send} disabled={!draft.trim()} aria-label="Send" className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-700 text-white disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
