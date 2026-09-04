import { Navigate } from "react-router-dom";

// Passwordless (OTP) authentication means there is no password to reset — this route
// exists to satisfy the app's routing surface and redirect users to the standard login flow.
export function ResetPasswordPage() {
  return <Navigate to="/login" replace />;
}
