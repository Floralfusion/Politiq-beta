import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, DEMO_MODE } from "@/constants/config";

/**
 * Supabase client for live mode. In DEMO_MODE this is still constructed (supabase-js tolerates
 * placeholder values) but is never actually called — see the DEMO_MODE branches in each service
 * under src/services/, which read/write src/demo/store.ts instead.
 *
 * To go live: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, and configure Clerk as a
 * third-party auth provider in Supabase so `supabase.auth` sessions carry the Clerk JWT
 * (Authentication > Sign In / Providers > Clerk in the Supabase Dashboard). See docs/security.md.
 */
export const supabase = createClient(SUPABASE_URL ?? "https://placeholder.supabase.co", SUPABASE_ANON_KEY ?? "placeholder-anon-key", {
  auth: { persistSession: !DEMO_MODE, autoRefreshToken: !DEMO_MODE },
});
