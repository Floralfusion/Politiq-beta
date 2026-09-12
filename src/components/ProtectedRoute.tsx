import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Client-side gate only — this improves UX (no flash of protected content) but is NOT the
 * security boundary. Real authorization is enforced server-side:
 *  - Supabase Row Level Security policies (see supabase/migrations) for all data access.
 *  - Clerk session verification in Supabase Edge Functions for privileged operations.
 * Never rely on this component alone to protect sensitive data or actions.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  // Wait for Clerk to actually finish checking the session before deciding anything. Redirecting
  // during this brief loading window is what caused the login/onboarding loop — a real Clerk
  // session hadn't finished loading yet, so it looked identical to "not signed in."
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-400">
        Loading…
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
