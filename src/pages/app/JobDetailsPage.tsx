import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, Building2 } from "lucide-react";
import { Button, Badge, EmptyState } from "@/components/ui";
import { jobs } from "@/demo/seedData";
import { toast } from "@/components/ui/Toast";

export function JobDetailsPage() {
  const { jobId } = useParams();
  const job = jobs.find((j) => j.id === jobId);

  if (!job) return <EmptyState title="Job not found" description="This posting may have been removed." />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/jobs" className="text-sm text-navy-700 hover:underline">← Back to jobs</Link>
      <div className="mt-4 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-navy-800">{job.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600"><Building2 size={14} /> {job.organisationName}</p>
          </div>
          <Badge tone="navy">{job.type}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
          <span className="flex items-center gap-1"><Briefcase size={12} /> {job.category}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> Posted {new Date(job.postedAt).toLocaleDateString("en-IN")}</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink-700">{job.description}</p>
        <p className="mt-4 text-xs text-ink-400">{job.applicantCount} people have applied</p>
        <Button className="mt-5 w-full sm:w-auto" onClick={() => toast("Application sent. The organisation will review and be in touch.", "success")}>
          Apply / Contact
        </Button>
      </div>
    </div>
  );
}
