import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";
import { DOCUMENTS } from "@/features/kyc/fields";
import { IconArrow, IconFile } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_MX", title: siteContent.home.title, description: siteContent.description, url: "/", siteName: siteContent.name },
};

export default function HomePage() {
  const home = siteContent.home;
  return <main id="contenido" tabIndex={-1} className="container home">
    <section className="home-intro" aria-labelledby="home-title">
      <h1 id="home-title">{home.title}</h1>
      <p className="lead">{home.lead}</p>
      <Link className="button" href={siteContent.cta.href}>{home.cta} <IconArrow className="icon" /></Link>
    </section>
    <section className="home-docs card" aria-labelledby="docs-title">
      <h2 id="docs-title">{home.documentsTitle}</h2>
      <ul className="doc-list">
        {DOCUMENTS.map(document => <li key={document.id}>
          <IconFile className="icon" />
          <span>{document.label}{document.hint && <small>{document.hint}</small>}</span>
          {!document.required && <em className="tag">Opcional</em>}
        </li>)}
      </ul>
    </section>
  </main>;
}
