import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { APP_NAME } from "@/constants/config";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";
import type { ProfessionalCategory } from "@/types";

const categories: ProfessionalCategory[] = [
  "Political Professional", "Political Staff", "Campaign Professional", "Political Consultant",
  "Party Professional", "Public Affairs", "Policy Professional", "Journalist", "Researcher", "Organisation",
];

const TOTAL_STEPS = 5;

export function OnboardingPage() {
  const navigate = useNavigate();
  const completeOnboarding = useDemoStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ProfessionalCategory | null>(null);
  const [form, setForm] = useState({ fullName: "", location: "", role: "", organisation: "", headline: "", expertise: "", about: "" });

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    completeOnboarding();
    toast("Your profile is set up. Welcome to POLITIQ.", "success");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="container-page py-8">
        <p className="font-serif text-lg font-semibold text-navy-800">{APP_NAME}</p>
        <div className="mt-6 h-1.5 w-full rounded-full bg-ink-200">
          <div className="h-full rounded-full bg-navy-700 transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        <div className="mx-auto mt-10 max-w-lg">
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-navy-800">Find the Right Person. Build Trusted Connections.</h1>
              <p className="mt-3 text-ink-600">Let's set up your professional identity on POLITIQ. It takes about two minutes.</p>
              <Button size="lg" className="mt-8" onClick={next}>Get started <ArrowRight size={16} /></Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-navy-800">What best describes you?</h2>
              <p className="mt-1.5 text-sm text-ink-600">Choose your professional category.</p>
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors ${
                      category === c ? "border-navy-700 bg-navy-50 text-navy-800" : "border-ink-200 text-ink-700 hover:border-navy-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={back}><ArrowLeft size={16} /> Back</Button>
                <Button onClick={next} disabled={!category}>Continue <ArrowRight size={16} /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-navy-800">Professional information</h2>
              <p className="mt-1.5 text-sm text-ink-600">Tell us about your current role.</p>
              <div className="mt-6 space-y-4">
                <Input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <Input placeholder="Location (city, country)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <Input placeholder="Current role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                <Input placeholder="Organisation" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} />
                <Input placeholder="Professional headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
                <Input placeholder="Areas of expertise (comma separated)" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={back}><ArrowLeft size={16} /> Back</Button>
                <Button onClick={next}>Continue <ArrowRight size={16} /></Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-navy-800">Tell your story</h2>
              <p className="mt-1.5 text-sm text-ink-600">A short summary helps people understand your work. You can add experience and education later from your profile.</p>
              <div className="mt-6">
                <Textarea rows={5} placeholder="About you..." value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={back}><ArrowLeft size={16} /> Back</Button>
                <Button onClick={next}>Continue <ArrowRight size={16} /></Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <ShieldCheck size={40} className="mx-auto text-navy-700" />
              <h2 className="mt-4 text-2xl font-semibold text-navy-800">Build trust with a verified professional identity.</h2>
              <p className="mt-2 text-sm text-ink-600">Verification is optional right now, but verified profiles get more visibility and trust from other professionals.</p>
              <ul className="mt-5 mx-auto max-w-xs space-y-2 text-left text-sm text-ink-700">
                {["Identity verification", "Professional verification", "Experience verification"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check size={15} className="text-success-500" /> {f}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-2.5">
                <Button onClick={finish}>Start verification later</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    completeOnboarding();
                    navigate("/verification");
                  }}
                >
                  Begin verification now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
