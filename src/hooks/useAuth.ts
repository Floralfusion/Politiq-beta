import { useCallback, useMemo } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { DEMO_MODE, CLERK_PUBLISHABLE_KEY } from "@/constants/config";
import { useDemoStore } from "@/demo/store";
import { currentProfile } from "@/demo/seedData";

// Whether a real Clerk session is even possible in this deployment. This mirrors the exact
// condition src/app/providers.tsx uses to decide whether <ClerkProvider> is mounted at all —
// the two must always agree, or the Clerk hooks below will throw ("used outside <ClerkProvider>").
const CLERK_ENABLED = !DEMO_MODE && !!CLERK_PUBLISHABLE_KEY;

/**
 * Unified auth hook.
 *
 * In DEMO_MODE, authentication state is simulated locally (see src/demo/store.ts) so every
 * screen and flow is explorable without any external credentials.
 *
 * In live mode, this now reads the REAL Clerk session via useUser()/useClerk() — previously this
 * hook only ever checked the local demo toggle, which meant a real Clerk sign-in was never
 * recognized by the app's route guards (ProtectedRoute/AdminRoute), causing an infinite
 * onboarding/login redirect loop after a genuine sign-up. That bug is fixed here.
 *
 * CLERK_ENABLED is fixed for the lifetime of a given deployment (derived from env vars at boot,
 * never changes at runtime), so calling Clerk's hooks conditionally on it — rather than
 * unconditionally at the top of this function — is safe in practice even though it deviates
 * from the usual "hooks must be unconditional" guidance, which exists to guard against
 * conditions that change between renders. This one never does.
 */
export function useAuth() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkUser = CLERK_ENABLED ? useUser() : null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerk = CLERK_ENABLED ? useClerk() : null;

  const demoSignedIn = useDemoStore((s) => s.currentUserSignedIn);
  const demoSignIn = useDemoStore((s) => s.signIn);
  const demoSignOut = useDemoStore((s) => s.signOut);
  const onboardingComplete = useDemoStore((s) => s.onboardingComplete);

  const isSignedIn = CLERK_ENABLED ? !!clerkUser?.isSignedIn : demoSignedIn;
  // Demo mode has no async loading step, so it's always "loaded" immediately. Live mode must
  // wait for Clerk to actually finish checking the session before treating "not signed in yet"
  // as "definitely signed out" — without this, route guards fire during Clerk's brief initial
  // loading window, incorrectly bounce a genuinely-signed-in user to /login, and Clerk's own
  // <SignIn> then sees an active session and redirects back — producing exactly the
  // login/onboarding ping-pong loop this fixes.
  const isLoaded = CLERK_ENABLED ? !!clerkUser?.isLoaded : true;

  const signOut = useCallback(() => {
    if (CLERK_ENABLED && clerk) {
      void clerk.signOut();
    }
    demoSignOut();
  }, [clerk, demoSignOut]);

  const signIn = useCallback(() => {
    // Only meaningful in demo mode — in live mode, Clerk's own <SignIn>/<SignUp> components
    // establish the session directly; nothing here needs to (or can) force that.
    demoSignIn();
  }, [demoSignIn]);

  return useMemo(
    () => ({
      isSignedIn,
      isLoaded,
      isDemo: DEMO_MODE,
      onboardingComplete,
      // NOTE: still returns the fixed demo profile even for real, live-signed-in Clerk users —
      // there is no live wiring yet from a real Clerk account to a real Supabase `profiles` row,
      // so a genuine account will correctly be treated as signed-in (this fix) but will still see
      // placeholder profile data (name/avatar/stats) everywhere the app displays "your profile"
      // until that wiring is added (see docs/security.md's note on the missing clerk-webhook
      // function, and src/services/profileService.ts for the read-side pattern to extend).
      user: currentProfile,
      signIn,
      signOut,
    }),
    [isSignedIn, isLoaded, onboardingComplete, signIn, signOut]
  );
}
