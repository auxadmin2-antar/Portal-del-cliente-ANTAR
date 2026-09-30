import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/config/supabase.server";
import type { Database } from "@/types/database.generated";

// Privileged operations only. Each caller must authorize the acting user first.
export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not configured");
  return createClient<Database>(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
