import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Users, Link2 } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { useDemoStore } from "@/demo/store";

export function EventDetailsPage() {
  const { eventId } = useParams();
  const events = useDemoStore((s) => s.events);
  const toggleEventAttendance = useDemoStore((s) => s.toggleEventAttendance);
  const event = events.find((e) => e.id === eventId);

  if (!event) return <EmptyState title="Event not found" />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/events" className="text-sm text-navy-700 hover:underline">← Back to events</Link>
      <div className="mt-4 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <h1 className="text-xl font-semibold text-navy-800">{event.title}</h1>
        <p className="mt-1 text-sm text-ink-600">Organised by {event.organiser}</p>
        <div className="mt-4 space-y-2 text-sm text-ink-600">
          <p className="flex items-center gap-2"><Calendar size={15} /> {event.date} • {event.time}</p>
          <p className="flex items-center gap-2"><MapPin size={15} /> {event.location}</p>
          {event.onlineLink && <p className="flex items-center gap-2"><Link2 size={15} /> Online link available after registering</p>}
          <p className="flex items-center gap-2"><Users size={15} /> {event.attendeeCount} attending</p>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink-700">{event.description}</p>
        <Button className="mt-5" variant={event.isAttending ? "secondary" : "primary"} onClick={() => toggleEventAttendance(event.id)}>
          {event.isAttending ? "You're registered" : "Register interest"}
        </Button>
      </div>
    </div>
  );
}
