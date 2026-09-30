import type { Metadata } from "next";
import { connection } from "next/server";
import { readSiteConfig } from "@/config/site";
import { siteContent } from "@/content/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const site = readSiteConfig(process.env);
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: `${siteContent.product} · ${siteContent.name}`, template: `%s · ${siteContent.name}` },
  description: siteContent.description,
  robots: { index: site.indexable, follow: site.indexable },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Render dinámico: la CSP usa un nonce distinto por petición (src/proxy.ts).
  await connection();
  return <html lang={siteContent.language}><body><a className="skip-link" href="#contenido">Saltar al contenido</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
