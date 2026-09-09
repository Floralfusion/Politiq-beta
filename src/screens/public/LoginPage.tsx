import { SignIn } from "@clerk/clerk-react";
import { DEMO_MODE } from "@/constants/config";
import { DemoOtpAuth } from "./DemoOtpAuth";

export function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      {DEMO_MODE ? (
        <DemoOtpAuth mode="login" />
      ) : (
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/onboarding"
          appearance={{ variables: { colorPrimary: "#152A54" } }}
        />
      )}
    </div>
  );
}
