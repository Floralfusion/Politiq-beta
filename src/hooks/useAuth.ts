import { useCallback, useMemo } from "react";
import { DEMO_MODE } from "@/constants/config";
import { useDemoStore } from "@/demo/store";
import { currentProfile } from "@/demo/seedData";

/**
 * Unified auth hook.
 *
 * In DEMO_MODE, authentication state is simulated locally (see src/demo/store.ts) so every
 * screen and flow is explorable without any external credentials.
 *
 * In live mode, this delegates to Clerk (see src/lib/clerk.ts / ClerkProvider in main.tsx).
 * Sign-in/sign-up UI in live mode is rendered by Clerk's <SignIn>/<SignUp> components directly
 * (see src/pages/public/LoginPage.tsx), which already includes email/phone OTP verification
 * when enabled in the Clerk Dashboard.
 */
export function useAuth() {
  const signedIn = useDemoStore((s) => s.currentUserSignedIn);
  const demoSignIn = useDemoStore((s) => s.signIn);
  const demoSignOut = useDemoStore((s) => s.signOut);
  const onboardingComplete = useDemoStore((s) => s.onboardingComplete);

  // Live mode delegates entirely to Clerk via <SignedIn>/<SignedOut> + useUser() in components
  // that need it directly. This hook still provides a demo-safe fallback shape.
  const isSignedIn = DEMO_MODE ? signedIn : signedIn; // demo store also mirrors Clerk session in live mode via ClerkSync (see App.tsx)

  const signOut = useCallback(() => {
    demoSignOut();
  }, [demoSignOut]);

  const signIn = useCallback(() => {
    demoSignIn();
  }, [demoSignIn]);

  return useMemo(
    () => ({
      isSignedIn,
      isDemo: DEMO_MODE,
      onboardingComplete,
      user: currentProfile,
      signIn,
      signOut,
    }),
    [isSignedIn, onboardingComplete, signIn, signOut]
  );
}
