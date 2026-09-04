import { useParams } from "react-router-dom";
import { Building2, Globe, MapPin, Users } from "lucide-react";
import { Badge, Button, EmptyState, VerificationBadge } from "@/components/ui";
import { ProfileCard } from "@/components/ProfileCard";
import { organisations } from "@/demo/seedData";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";

export function OrganisationPage() {
  const { orgId } = useParams();
  const org = organisations.find((o) => o.id === orgId);
  const profiles = useDemoStore((s) => s.profiles);

  if (!org) return <EmptyState title="Organisation not found" />;
  const members = profiles.filter((p) => p.organisationId === org.id);

  return (
    <div>
      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
            <Building2 size={30} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl font-semibold text-navy-800">{org.name}</h1>
              {org.isVerified && <VerificationBadge size={16} />}
            </div>
            <p className="mt-1 text-sm text-ink-600">{org.description}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-500">
              <span className="flex items-center gap-1"><Badge tone="neutral">{org.category}</Badge></span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {org.location}</span>
              <span className="flex items-center gap-1"><Users size={12} /> {org.memberCount.toLocaleString()} members</span>
              {org.website && <span className="flex items-center gap-1"><Globe size={12} /> {org.website}</span>}
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast(`Following ${org.name}.`, "success")}>Follow</Button>
        </div>
      </div>

      <h2 className="mt-6 mb-3 font-semibold text-navy-800">People at {org.name}</h2>
      {members.length === 0 ? (
        <EmptyState title="No profiles listed yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((p) => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  );
}
