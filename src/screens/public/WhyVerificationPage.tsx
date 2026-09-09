import { Link } from "react-router-dom";
import { ShieldCheck, UserCheck, Building2, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

const types = [
  { icon: UserCheck, title: "Identity", body: "Confirms a professional is who they claim to be, using a government-issued ID and a liveness check." },
  { icon: Briefcase, title: "Professional", body: "Confirms a professional's current role, using employment documentation." },
  { icon: Building2, title: "Organisation", body: "Confirms an organisation's registration and authorisation to represent itself on POLITIQ." },
  { icon: CheckCircle2, title: "Experience", body: "Confirms specific roles listed on a profile's experience timeline." },
];

export function WhyVerificationPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <ShieldCheck size={30} className="text-navy-700" />
        <h1 className="mt-4 text-3xl font-semibold text-navy-800">Why verification matters</h1>
        <p className="mt-3 text-ink-600">
          Politics and public life depend on knowing exactly who you're dealing with. POLITIQ's verification system lets professionals prove
          their identity, role, organisation and experience — so trust doesn't have to be assumed.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {types.map((t) => (
          <div key={t.title} className="rounded-xl border border-ink-100 p-5">
            <t.icon className="text-navy-700" size={22} />
            <p className="mt-3 font-semibold text-navy-800">{t.title}</p>
            <p className="mt-1.5 text-sm text-ink-600">{t.body}</p>
          </div>
        ))}
      </div>
      <Link to="/signup" className="mt-10 inline-block"><Button size="lg">Join and get verified</Button></Link>
    </div>
  );
}
