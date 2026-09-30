type HealthDependency = "supabaseAuth" | "supabaseRest";
type DependencyState = "healthy" | "unhealthy" | "unreachable";

export async function checkDependencies(baseUrl: string, key: string, fetcher: typeof fetch = fetch) {
  const endpoints: [HealthDependency, string][] = [
    ["supabaseAuth", "/auth/v1/health"],
    ["supabaseRest", "/rest/v1/"],
  ];
  const results = await Promise.all(endpoints.map(async ([name, path]) => {
    let state: DependencyState;
    try {
      const response = await fetcher(baseUrl.replace(/\/+$/, "") + path, {
        headers: { apikey: key },
        signal: AbortSignal.timeout(2500),
        cache: "no-store",
        redirect: "error",
      });
      state = response.ok ? "healthy" : "unhealthy";
      await response.body?.cancel();
    } catch {
      state = "unreachable";
    }
    return [name, state] as const;
  }));
  return {
    ready: results.every(([, state]) => state === "healthy"),
    dependencies: Object.fromEntries(results),
  };
}
