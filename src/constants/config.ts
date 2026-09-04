// Central runtime configuration. All flags are read once at boot.

export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const APP_URL = (import.meta.env.VITE_APP_URL as string | undefined) ?? "http://localhost:5173";

const explicitDemoFlag = import.meta.env.VITE_DEMO_MODE === "true";
const hasClerkKey = !!CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith("pk_");
const hasSupabaseKeys = !!SUPABASE_URL && !!SUPABASE_ANON_KEY && SUPABASE_URL.startsWith("http") && !SUPABASE_URL.includes("xxxx");

/**
 * DEMO_MODE controls whether the app talks to real Clerk/Supabase/Cashfree services
 * or runs entirely against local, in-browser mock data (see src/demo).
 *
 * FORCED TO FALSE: Bypassing automated checks to force live database connections.
 */
export const DEMO_MODE = false;

export const PAYMENTS_DEMO_MODE = false;

export const APP_NAME = "POLITIQ";
export const APP_TAGLINE = "Find the Right Person. Build Trusted Connections.";
