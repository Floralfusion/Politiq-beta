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
 * The app auto-falls-back to demo mode if real keys are missing or clearly placeholders,
 * so it is always explorable immediately after `npm install && npm run dev` with zero setup.
 * Once real VITE_CLERK_PUBLISHABLE_KEY / VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY values
 * are supplied, the app automatically switches to live mode (unless VITE_DEMO_MODE=true is
 * explicitly forced).
 */
export const DEMO_MODE = explicitDemoFlag || !hasClerkKey || !hasSupabaseKeys;

export const PAYMENTS_DEMO_MODE = import.meta.env.VITE_PAYMENTS_DEMO_MODE !== "false";

export const APP_NAME = "POLITIQ";
export const APP_TAGLINE = "Find the Right Person. Build Trusted Connections.";
