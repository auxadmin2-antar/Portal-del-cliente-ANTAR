import { backendRequired } from "@/config/supabase.schema";
import { getSupabaseConfig } from "@/config/supabase.server";
import { checkDependencies } from "@/lib/health";
export const dynamic = "force-dynamic";
export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    if (!backendRequired(process.env.SUPABASE_REQUIRED)) {
      return Response.json({ status: "ready", backend: "not_required" }, { headers });
    }
    const config = getSupabaseConfig();
    const result = await checkDependencies(config.url, config.key);
    return Response.json({ status: result.ready ? "ready" : "not_ready", dependencies: result.dependencies }, { status: result.ready ? 200 : 503, headers });
  } catch {
    return Response.json({ status: "not_ready" }, { status: 503, headers });
  }
}
