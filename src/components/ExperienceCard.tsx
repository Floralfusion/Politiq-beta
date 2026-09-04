import { Briefcase } from "lucide-react";
import type { Experience } from "@/types";
import { Badge } from "@/components/ui";

function formatRange(start: string, end?: string) {
  const s = new Date(start).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  const e = end ? new Date(end).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Present";
  return `${s} – ${e}`;
}

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        <Briefcase size={18} />
      </div>
      <div className="min-w-0 flex-1 pb-5 border-b border-ink-100 last:border-0 last:pb-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-navy-800 text-sm">{experience.role}</p>
          {experience.verified ? <Badge tone="success">Verified</Badge> : <Badge tone="neutral">Unverified</Badge>}
        </div>
        <p className="text-sm text-ink-700">{experience.organisation}</p>
        <p className="text-xs text-ink-400">{formatRange(experience.startDate, experience.endDate)}{experience.location ? ` • ${experience.location}` : ""}</p>
        {experience.description && <p className="mt-1.5 text-sm text-ink-600">{experience.description}</p>}
      </div>
    </div>
  );
}
