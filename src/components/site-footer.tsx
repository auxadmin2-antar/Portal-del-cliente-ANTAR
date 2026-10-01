import Link from "next/link";
import { siteContent } from "@/content/site";
export function SiteFooter() {
  return <footer className="site-footer"><div className="container">
    <div>
      <strong>{siteContent.name}</strong>
      <p>{siteContent.product}</p>
    </div>
    <nav aria-label="Enlaces del pie" className="footer-links">
      <Link href={siteContent.cta.href}>{siteContent.cta.label}</Link>
      <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
      <Link href="/acuerdo-de-confidencialidad">Acuerdo de confidencialidad</Link>
    </nav>
  </div></footer>;
}
