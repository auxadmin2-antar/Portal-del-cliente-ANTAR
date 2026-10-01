import type { MetadataRoute } from "next";
import { readSiteConfig } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = readSiteConfig(process.env);
  // Only add published canonical pages. Do not fabricate modification dates.
  return site.indexable ? [{ url: site.origin + "/" }, { url: site.origin + "/registro" }, { url: site.origin + "/aviso-de-privacidad" }, { url: site.origin + "/acuerdo-de-confidencialidad" }] : [];
}
