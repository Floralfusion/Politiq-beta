import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { EventItem } from "@/types";
import { Button } from "@/components/ui";
import { useDemoStore } from "@/demo/store";

export function EventCard({ event }: { event: EventItem }) {
  const toggleEventAttendance = useDemoStore((s) => s.toggleEventAttendance);
  const d = new Date(event.date);
  const day = d.toLocaleDateString("en-IN", { day: "2-digit" });
  const month = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
      <div className="flex w-14 shrink-0 flex-col items-center rounded-lg border border-ink-100 bg-navy-50 py-2">
        <span className="text-xs font-semibold text-danger-500">{month}</span>
        <span className="text-lg font-bold text-navy-800">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <Link to={`/events/${event.id}`} className="font-semibold text-navy-800 text-sm hover:underline">
          {event.title}
        </Link>
        <p className="mt-0.5 text-xs text-ink-500">{event.date} • {event.time}</p>
        <p className="flex items-center gap-1 text-xs text-ink-500"><MapPin size={11} /> {event.location}</p>
        <Button
          size="sm"
          variant={event.isAttending ? "secondary" : "outline"}
          className="mt-2"
          onClick={() => toggleEventAttendance(event.id)}
        >
          {event.isAttending ? "Interested" : "I'm interested"}
        </Button>
      </div>
    </div>
  );
}
