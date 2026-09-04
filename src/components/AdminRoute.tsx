import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Client-side gate only. Real admin authorization MUST be enforced server-side:
 *  - `admin_users` table + role checks inside every Supabase Edge Function handling admin actions.
 *  - RLS policies that check `auth.uid()` against `admin_users` before allowing reads/writes to
 *    admin-only tables (reports, audit_logs, system_settings, verification_reviews, etc).
 * See docs/security.md and docs/admin.md.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isSignedIn, isDemo } = useAuth();
  // In demo mode, any signed-in demo user may preview the admin console for evaluation purposes.
  // In live mode, wire this to a verified admin_users lookup (see services/adminService.ts).
  if (!isSignedIn && !isDemo) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
