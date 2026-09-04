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
  const { isSignedIn } = useAuth();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
