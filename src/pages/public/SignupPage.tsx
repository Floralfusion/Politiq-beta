import { SignUp } from "@clerk/clerk-react";
import { DEMO_MODE } from "@/constants/config";
import { DemoOtpAuth } from "./DemoOtpAuth";

export function SignupPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      {DEMO_MODE ? (
        <DemoOtpAuth mode="signup" />
      ) : (
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl="/onboarding"
          appearance={{ variables: { colorPrimary: "#152A54" } }}
        />
      )}
    </div>
  );
}
