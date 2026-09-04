import { Users, UserCheck, ShieldCheck, Flag, Link2, CreditCard, Badge as BadgeIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { profiles } from "@/demo/seedData";

export function AdminDashboardPage() {
  const reports = useDemoStore((s) => s.reports);
  const verificationRequests = useDemoStore((s) => s.verificationRequests);
  const contactRequestsIncoming = useDemoStore((s) => s.contactRequestsIncoming);
  const payments = useDemoStore((s) => s.payments);

  const verifiedCount = profiles.filter((p) => p.isVerified).length;
  const pendingReports = reports.filter((r) => r.status === "OPEN").length;
  const pendingVerifications = verificationRequests.filter((v) => v.status === "UNDER_REVIEW" || v.status === "SUBMITTED").length;
  const successfulPayments = payments.filter((p) => p.status === "SUCCESS").length;

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Development seed data shown below — clearly not production metrics." />
      <div className="mb-4">
        <Badge tone="warning"><BadgeIcon size={11} className="mr-1" /> Development seed data</Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Total profiles" value={profiles.length} icon={Users} />
        <StatCard label="Verified profiles" value={verifiedCount} icon={UserCheck} tone="success" />
        <StatCard label="Pending verifications" value={pendingVerifications} icon={ShieldCheck} tone="warning" />
        <StatCard label="Open reports" value={pendingReports} icon={Flag} tone="danger" />
        <StatCard label="Contact requests" value={contactRequestsIncoming.length} icon={Link2} />
        <StatCard label="Successful payments" value={successfulPayments} icon={CreditCard} tone="success" />
      </div>
    </div>
  );
}
