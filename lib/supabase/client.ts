import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Minimal hand-written schema type — just enough for the tables/views this
 * app touches. Without this, supabase-js has no row shape to infer and
 * `.select()` results type-check as `never` under strict mode. If you later
 * generate full types with the Supabase CLI (`supabase gen types typescript`),
 * swap this out for the generated `Database` type.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          level: number;
          xp: number;
          wins: number;
          losses: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          level?: number;
          xp?: number;
          wins?: number;
          losses?: number;
        };
        Update: {
          username?: string;
          level?: number;
          xp?: number;
          wins?: number;
          losses?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      leaderboard: {
        Row: {
          username: string;
          level: number;
          xp: number;
          wins: number;
          losses: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

let client: SupabaseClient<Database> | null = null;

/**
 * Lazily creates the Supabase client so the app doesn't crash at build time
 * when env vars aren't set yet (e.g. before the studio owner has configured
 * Supabase). Callers should check `isSupabaseConfigured()` first.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!client) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
