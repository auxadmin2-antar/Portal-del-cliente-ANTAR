import { z } from "zod";

function isPublicKey(value: string) {
  if (/^(REPLACE_|CHANGE_ME|sb_secret_)/i.test(value)) return false;
  // Also reject legacy administrative JWT keys mistakenly placed in public config.
  const payload = value.split(".")[1];
  if (payload) {
    try {
      const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      if (decoded.role === "service_role") return false;
    } catch { /* The provider validates key authenticity; this is a leak-prevention check. */ }
  }
  return true;
}

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().refine(value => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().trim().min(1).refine(isPublicKey),
});

export function readSupabaseConfig(values: Record<string, string | undefined>) {
  const parsed = schema.safeParse(values);
  if (!parsed.success) throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return { url: parsed.data.NEXT_PUBLIC_SUPABASE_URL, key: parsed.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY };
}

export function backendRequired(value: string | undefined) {
  if (value !== undefined && value !== "true" && value !== "false") throw new Error("SUPABASE_REQUIRED must be true or false");
  return value === "true";
}
