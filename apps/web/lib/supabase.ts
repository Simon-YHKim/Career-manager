import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;

/**
 * Browser-side Supabase singleton. Reads NEXT_PUBLIC_SUPABASE_URL +
 * _ANON_KEY at module load time (these are baked into the static
 * export at build time when set).
 *
 * Returns null when env vars are missing — callers gate UI on
 * `isAuthConfigured()` so we don't crash on the public Pages build
 * which intentionally ships without secrets.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return cached;
}

export function isAuthConfigured(): boolean {
  return Boolean(url && anonKey);
}
