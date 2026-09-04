import { DEMO_MODE } from "@/constants/config";
import { supabase } from "@/lib/supabase";
import { useDemoStore } from "@/demo/store";
import type { Profile } from "@/types";

/**
 * profileService — reference implementation showing the demo/live split used across every
 * service in src/services/. Other services (networkService, jobService, groupService,
 * eventService, notificationService, adminService, verificationService, contactService) follow
 * this identical pattern: a DEMO_MODE branch reading/writing src/demo/store.ts, and a live branch
 * querying Supabase directly (reads) or invoking Edge Functions (privileged writes).
 */
export const profileService = {
  async getByUsername(username: string): Promise<Profile | undefined> {
    if (DEMO_MODE) {
      return useDemoStore.getState().profiles.find((p) => p.username === username);
    }
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `id, username, full_name, headline, category, organisation_id, location, avatar_url, cover_url,
         about, years_experience, nationality, languages, is_verified, connections_count, followers_count,
         following_count, created_at, organisations ( name )`
      )
      .eq("username", username)
      .is("deleted_at", null)
      .single();
    if (error || !data) return undefined;
    return mapDbProfile(data);
  },

  async updateOwnProfile(patch: Partial<Pick<Profile, "fullName" | "headline" | "location" | "about" | "organisationName">>) {
    if (DEMO_MODE) return; // demo store mutations happen directly from page components
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: patch.fullName,
        headline: patch.headline,
        location: patch.location,
        about: patch.about,
      })
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
    if (error) throw error;
  },
};

// Narrow, defensive mapper — Supabase returns snake_case rows; the app's types are camelCase.
interface RawProfileRow {
  id: string;
  username: string;
  full_name: string;
  headline: string | null;
  category: Profile["category"];
  location: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  about: string | null;
  years_experience: number | null;
  nationality: string | null;
  languages: string[] | null;
  is_verified: boolean;
  connections_count: number | null;
  followers_count: number | null;
  following_count: number | null;
  created_at: string;
  organisations?: { name: string }[] | null;
}

function mapDbProfile(row: RawProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    headline: row.headline ?? "",
    category: row.category,
    organisationName: row.organisations?.[0]?.name,
    location: row.location ?? "",
    avatarUrl: row.avatar_url ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    about: row.about ?? undefined,
    yearsExperience: row.years_experience ?? undefined,
    nationality: row.nationality ?? undefined,
    languages: row.languages ?? [],
    isVerified: row.is_verified,
    verifications: [],
    connectionsCount: row.connections_count ?? 0,
    followersCount: row.followers_count ?? 0,
    followingCount: row.following_count ?? 0,
    memberSince: row.created_at,
    connectionStatus: "NONE",
    isFollowing: false,
  };
}
