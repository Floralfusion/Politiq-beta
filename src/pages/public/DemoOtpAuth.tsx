import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useDemoStore } from "@/demo/store";

const DEMO_OTP = "123456";

/**
 * Demo-mode authentication flow that mirrors a real OTP experience (email/phone entry,
 * then a 6-digit code) without requiring live Clerk credentials. This is what renders
 * automatically when VITE_CLERK_PUBLISHABLE_KEY is not configured — see src/constants/config.ts.
 * Once real Clerk keys are supplied, LoginPage/SignupPage render Clerk's own <SignIn>/<SignUp>
 * components instead, which include real email/phone OTP verification end-to-end.
 */
export function DemoOtpAuth({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const onboardingComplete = useDemoStore((s) => s.onboardingComplete);
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Enter your email or phone number.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast(`Verification code sent to ${identifier}. Demo code: ${DEMO_OTP}`, "info");
    }, 500);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError("Incorrect code. Use the demo code shown in the toast (123456).");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signIn();
      setLoading(false);
      toast(mode === "signup" ? "Account created." : "Welcome back.", "success");
      navigate(onboardingComplete ? "/home" : "/onboarding");
    }, 500);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="flex items-center gap-2 text-navy-700 mb-2">
        <ShieldCheck size={18} />
        <span className="text-xs font-medium">Secured with one-time password verification</span>
      </div>
      <h1 className="text-2xl font-semibold text-navy-800">{mode === "signup" ? "Create your POLITIQ account" : "Log in to POLITIQ"}</h1>
      <p className="mt-1.5 text-sm text-ink-500">
        {mode === "signup" ? "Start with your email or phone number." : "Enter your email or phone number to continue."}
      </p>

      {step === "identifier" ? (
        <form onSubmit={requestOtp} className="mt-6 space-y-4">
          <div>
            <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-ink-700">Email or phone number</label>
            <Input id="identifier" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setError(""); }} placeholder="you@example.com or +91 98765 43210" error={error} />
          </div>
          <Button type="submit" className="w-full" loading={loading}>Send verification code</Button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="mt-6 space-y-4">
          <button type="button" onClick={() => setStep("identifier")} className="flex items-center gap-1 text-xs text-ink-500 hover:text-navy-700">
            <ArrowLeft size={12} /> Change {identifier.includes("@") ? "email" : "number"}
          </button>
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-ink-700">Enter the 6-digit code</label>
            <Input id="otp" value={otp} onChange={(e) => { setOtp(e.target.value); setError(""); }} placeholder="123456" inputMode="numeric" maxLength={6} error={error} />
            <p className="mt-1.5 text-xs text-ink-400">Demo mode code: <span className="font-mono font-medium text-ink-600">123456</span></p>
          </div>
          <Button type="submit" className="w-full" loading={loading}>Verify &amp; continue</Button>
        </form>
      )}
    </div>
  );
}
