import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { DEMO_MODE } from "@/constants/config";

export function ForgotPasswordPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-14 text-center">
      <ShieldCheck size={28} className="text-navy-700" />
      <h1 className="mt-4 text-2xl font-semibold text-navy-800">No password to reset</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-600">
        POLITIQ uses one-time password verification instead of passwords.
        {DEMO_MODE
          ? " In demo mode, just head to login and use the on-screen demo code."
          : " Head to login and we'll send a fresh verification code to your email or phone."}
      </p>
      <Link to="/login" className="mt-6"><Button>Go to login</Button></Link>
    </div>
  );
}
