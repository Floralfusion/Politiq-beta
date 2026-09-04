import { cn } from "@/lib/utils";

export function MessageBubble({ content, mine, time }: { content: string; mine: boolean; time: string }) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          mine ? "bg-navy-700 text-white rounded-br-sm" : "bg-ink-100 text-ink-800 rounded-bl-sm"
        )}
      >
        <p>{content}</p>
        <p className={cn("mt-1 text-[10px]", mine ? "text-navy-200" : "text-ink-400")}>{time}</p>
      </div>
    </div>
  );
}
