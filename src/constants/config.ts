// Central runtime configuration. All flags are read once at boot.

export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const APP_URL = (import.meta.env.VITE_APP_URL as string | undefined) ?? "http://localhost:5173";

const explicitDemoFlag = import.meta.env.VITE_DEMO_MODE === "true";
const hasClerkKey = !!CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.startsWith("pk_");
const hasSupabaseKeys = !!SUPABASE_URL && !!SUPABASE_ANON_KEY && SUPABASE_URL.startsWith("http") && !SUPABASE_URL.includes("xxxx");

export const DEMO_MODE = false;
export const PAYMENTS_DEMO_MODE = false;

// ADD THESE TWO CLERK FALLBACKS:
export const SIGN_IN_URL = "/login";
export const SIGN_UP_URL = "/signup";

export const APP_NAME = "POLITIQ";
export const APP_TAGLINE = "Find the Right Person. Build Trusted Connections.";
