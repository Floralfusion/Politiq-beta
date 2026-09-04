import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock } from "lucide-react";
import type { Job } from "@/types";
import { Badge } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link to={`/jobs/${job.id}`} className="block rounded-xl border border-ink-100 bg-white p-5 shadow-card hover:border-navy-200 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-navy-800">{job.title}</p>
          <p className="text-sm text-ink-600">{job.organisationName}</p>
        </div>
        <Badge tone="navy">{job.type}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-500">
        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
        <span className="flex items-center gap-1"><Briefcase size={12} /> {job.category}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> Posted {timeAgo(new Date(job.postedAt).toISOString())}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-ink-600">{job.description}</p>
      <p className="mt-3 text-xs text-ink-400">{job.applicantCount} applicants</p>
    </Link>
  );
}
