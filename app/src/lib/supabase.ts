import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidUrl =
  typeof supabaseUrl === "string" && /^https?:\/\//.test(supabaseUrl);

/*
 * True once real credentials are in app/.env. getSupabase() returns null when
 * this is false, so pages can degrade gracefully (inline "not available yet"
 * message) instead of crashing — the placeholder values shipped in
 * .env.example are not a valid URL.
 */
const isSupabaseConfigured = Boolean(
  hasValidUrl && supabaseAnonKey && supabaseAnonKey !== "your-supabase-anon-key",
);

let client: SupabaseClient | null = null;

/** Lazily create the shared client. Returns null when env is unconfigured. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  if (!client) {
    client = createClient(supabaseUrl as string, supabaseAnonKey as string);
  }

  return client;
}
