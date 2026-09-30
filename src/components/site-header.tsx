import Link from "next/link";
import { siteContent } from "@/content/site";
export function SiteHeader() {
  return <header className="site-header"><div className="container">
    <Link href="/" className="wordmark" aria-label={`${siteContent.name}, ${siteContent.product}, inicio`}><strong>{siteContent.name}</strong><span>{siteContent.product}</span></Link>
    <nav aria-label="Navegación principal">{siteContent.navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
  </div></header>;
}
