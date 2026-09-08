import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Row shape for the `profiles` table / `leaderboard` view (see
 * supabase/schema.sql). Deliberately NOT wired into `createClient<Database>`:
 * supabase-js's generic schema inference is sensitive to internal
 * implementation details that changed across 2.4x/2.7x releases, and can
 * silently collapse every query result to `never` in ways that only show up
 * at build time. Casting at each call site (see lib/hooks/useProfile.ts and
 * app/leaderboard/page.tsx) is more verbose but doesn't depend on any of
 * that — it always compiles the same way regardless of the exact
 * supabase-js version npm resolves.
 */
export interface ProfileRow {
  id: string;
  username: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardRow {
  username: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
}

let client: SupabaseClient | null = null;

/**
 * Lazily creates the Supabase client so the app doesn't crash at build time
 * when env vars aren't set yet (e.g. before the studio owner has configured
 * Supabase). Callers should check `isSupabaseConfigured()` first.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
