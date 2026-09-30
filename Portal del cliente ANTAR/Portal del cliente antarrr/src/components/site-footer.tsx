import Link from "next/link";
import { siteContent } from "@/content/site";
export function SiteFooter() {
  return <footer className="site-footer"><div className="container">
    <p>{siteContent.name} · {siteContent.product}</p>
    <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
  </div></footer>;
}
