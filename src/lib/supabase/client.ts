"use client";
import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseConfig } from "@/config/supabase.schema";
import type { Database } from "@/types/database.generated";

export function createClient() {
  const config = readSupabaseConfig({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  return createBrowserClient<Database>(config.url, config.key);
}
