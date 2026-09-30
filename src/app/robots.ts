import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  const site = readSiteConfig(process.env);
  return site.indexable
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/account", "/admin", "/auth", "/api/"] }, sitemap: `${site.origin}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
