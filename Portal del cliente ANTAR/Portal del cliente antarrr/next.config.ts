import type { NextConfig } from "next";

const production = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      ...(production ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }] : []),
      ...(production && process.env.SITE_INDEXABLE === "true"
        ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
    ] }, {
      source: "/api/:path*",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    }];
  },
};
export default nextConfig;
