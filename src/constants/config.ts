// Central runtime configuration. All flags are read once at boot.
//
// NOTE: Next.js inlines `process.env.NEXT_PUBLIC_*` at build time ONLY when each reference is a
// static, literal property access like the ones below (e.g. `process.env.NEXT_PUBLIC_SUPABASE_URL`).
// Do not refactor these into a loop or dynamic lookup (e.g. `process.env[key]`) — that pattern is
// invisible to Next's bundler and will silently resolve to `undefined` in the browser.

export const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL as string | undefined) ?? "http://localhost:3000";

const explicitDemoFlag = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const hasClerkKey = !!CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith("pk_");
const hasSupabaseKeys = !!SUPABASE_URL && !!SUPABASE_ANON_KEY && SUPABASE_URL.startsWith("http") && !SUPABASE_URL.includes("xxxx");

/**
 * DEMO_MODE controls whether the app talks to real Clerk/Supabase/Cashfree services
 * or runs entirely against local, in-browser mock data (see src/demo).
 *
 * The app auto-falls-back to demo mode if real keys are missing or clearly placeholders,
 * so it is always explorable immediately after `npm install && npm run dev` with zero setup.
 * Once real NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
 * values are supplied, the app automatically switches to live mode (unless NEXT_PUBLIC_DEMO_MODE=true
 * is explicitly forced).
 */
export const DEMO_MODE = explicitDemoFlag || !hasClerkKey || !hasSupabaseKeys;

export const PAYMENTS_DEMO_MODE = process.env.NEXT_PUBLIC_PAYMENTS_DEMO_MODE !== "false";

export const APP_NAME = "POLITIQ";
export const APP_TAGLINE = "Find the Right Person. Build Trusted Connections.";
