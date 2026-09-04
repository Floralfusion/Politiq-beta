import { Building2 } from "lucide-react";
import type { Organisation } from "@/types";
import { Badge, VerificationBadge } from "@/components/ui";

export function OrganisationCard({ org }: { org: Organisation }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        <Building2 size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="truncate font-semibold text-navy-800 text-sm">{org.name}</p>
          {org.isVerified && <VerificationBadge size={13} />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{org.description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge tone="neutral">{org.category}</Badge>
          <Badge tone="neutral">{org.location}</Badge>
        </div>
      </div>
    </div>
  );
}
