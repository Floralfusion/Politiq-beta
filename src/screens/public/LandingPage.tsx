import { Link } from "react-router-dom";
import { ShieldCheck, Search, Users, Lock, Briefcase, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import { profiles } from "@/demo/seedData";

const steps = [
  { icon: Search, title: "Discover", body: "Search by role, expertise, organisation and location to find the right person for the work ahead." },
  { icon: ShieldCheck, title: "Verify", body: "Every profile can carry identity, professional and experience verification, reviewed by our team." },
  { icon: Users, title: "Connect", body: "Follow professionals, or send a connection request that they choose to accept." },
  { icon: Lock, title: "Request", body: "Ask for direct contact access. The recipient reviews and approves before anything is shared." },
  { icon: CheckCircle2, title: "Access", body: "Once approved and paid, permitted contact details unlock — never before." },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink-100">
        <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-navy-800">
              Find the Right Person.
              <br />
              Build Trusted Connections.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-600">
              POLITIQ is the professional network for politics and public life — built for discovery, verification and trusted access.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg">Join POLITIQ</Button></Link>
              <Link to="/discover"><Button size="lg" variant="secondary">Explore Professionals</Button></Link>
            </div>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-navy-50/60 p-6">
            <p className="text-xs font-medium text-ink-500 mb-4">People you might discover</p>
            <div className="space-y-3">
              {profiles.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3 border border-ink-100 shadow-card">
                  <img src={p.avatarUrl} alt={p.fullName} className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-800">{p.fullName}</p>
                    <p className="truncate text-xs text-ink-500">{p.headline}</p>
                  </div>
                  {p.isVerified && <ShieldCheck size={16} className="text-navy-700 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why POLITIQ */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="text-3xl font-semibold text-navy-800">Why POLITIQ</h2>
        <p className="mt-3 max-w-2xl text-ink-600">
          Politics and public life run on relationships built with care. POLITIQ replaces guesswork and cold outreach with a professional
          infrastructure designed specifically for this world — not a repurposed general social network.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl border border-ink-100 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
                <s.icon size={20} />
              </div>
              <p className="mt-4 font-semibold text-navy-800">{s.title}</p>
              <p className="mt-1.5 text-sm text-ink-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verification */}
      <section className="border-y border-ink-100 bg-ink-50">
        <div className="container-page py-16 sm:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-navy-800">Trust is built, not assumed</h2>
            <p className="mt-4 text-ink-600">
              Identity, professional standing, organisation affiliation and work experience can each be independently verified — so the
              people you connect with are exactly who they say they are.
            </p>
            <ul className="mt-6 space-y-3">
              {["Identity verification", "Professional credential verification", "Organisation verification", "Verified experience timeline"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink-700">
                  <CheckCircle2 size={16} className="text-success-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:underline">
              See POLITIQ Verified <ArrowRight size={15} />
            </Link>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <div className="flex items-center gap-2 text-navy-700">
              <ShieldCheck size={20} />
              <p className="font-semibold">POLITIQ Verified</p>
            </div>
            <p className="mt-2 text-sm text-ink-600">Stand out with a verified badge and priority review across all verification types.</p>
            <p className="mt-4 text-2xl font-semibold text-navy-800">₹999<span className="text-sm font-normal text-ink-500">/month</span></p>
            <Link to="/pricing"><Button className="mt-4 w-full">View pricing</Button></Link>
          </div>
        </div>
      </section>

      {/* Trusted contact access */}
      <section className="container-page py-16 sm:py-20 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-ink-100 p-6">
          <Lock className="text-navy-700" size={22} />
          <p className="mt-3 font-semibold text-navy-800">Trusted contact access</p>
          <p className="mt-1.5 text-sm text-ink-600">Private contact information is only ever shared after the recipient approves and payment is confirmed server-side.</p>
        </div>
        <div className="rounded-xl border border-ink-100 p-6">
          <Briefcase className="text-navy-700" size={22} />
          <p className="mt-3 font-semibold text-navy-800">Jobs in politics &amp; public life</p>
          <p className="mt-1.5 text-sm text-ink-600">Browse and apply to roles across campaigns, policy research, media and public affairs.</p>
        </div>
        <div className="rounded-xl border border-ink-100 p-6">
          <Calendar className="text-navy-700" size={22} />
          <p className="mt-3 font-semibold text-navy-800">Events &amp; groups</p>
          <p className="mt-1.5 text-sm text-ink-600">Find forums, summits and communities relevant to your work — and the people attending them.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-800">
        <div className="container-page py-16 text-center">
          <h2 className="text-3xl font-semibold text-white">Ready to find the right person?</h2>
          <p className="mt-3 text-navy-200">Join POLITIQ and start building trusted professional connections today.</p>
          <Link to="/signup" className="mt-7 inline-block">
            <Button size="lg" className="bg-white text-navy-800 hover:bg-ink-100">Join POLITIQ</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
