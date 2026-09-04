import { DEMO_MODE } from "@/constants/config";
import { supabase } from "@/lib/supabase";
import { useDemoStore } from "@/demo/store";
import type { Profile, ProfessionalCategory } from "@/types";

export interface DiscoverFilters {
  query?: string;
  category?: ProfessionalCategory | "";
  verifiedOnly?: boolean;
  page: number;
  pageSize: number;
}

export interface DiscoverResult {
  profiles: Profile[];
  total: number;
}

export const discoveryService = {
  async search(filters: DiscoverFilters): Promise<DiscoverResult> {
    if (DEMO_MODE) {
      const all = useDemoStore.getState().profiles;
      const q = (filters.query ?? "").trim().toLowerCase();
      const filtered = all.filter((p) => {
        if (q && !`${p.fullName} ${p.headline} ${p.location}`.toLowerCase().includes(q)) return false;
        if (filters.category && p.category !== filters.category) return false;
        if (filters.verifiedOnly && !p.isVerified) return false;
        return true;
      });
      const start = (filters.page - 1) * filters.pageSize;
      return { profiles: filtered.slice(start, start + filters.pageSize), total: filtered.length };
    }

    // Live: server-side filtering, indexed search, real pagination (never fetch the whole table).
    let q = supabase.from("profiles").select("*", { count: "exact" }).is("deleted_at", null);
    if (filters.query) q = q.ilike("full_name", `%${filters.query}%`);
    if (filters.category) q = q.eq("category", filters.category);
    if (filters.verifiedOnly) q = q.eq("is_verified", true);
    const start = (filters.page - 1) * filters.pageSize;
    const { data, count, error } = await q.range(start, start + filters.pageSize - 1);
    if (error) throw error;
    return { profiles: (data ?? []) as unknown as Profile[], total: count ?? 0 };
  },
};
