import "server-only";
import { readSupabaseConfig } from "./supabase.schema";
export function getSupabaseConfig() { return readSupabaseConfig(process.env); }
