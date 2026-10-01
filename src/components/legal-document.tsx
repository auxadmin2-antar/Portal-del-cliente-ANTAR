import Link from "next/link";
import type { LegalDocument } from "@/content/legal";
import { Notice } from "@/components/ui/notice";

function versionDate(version: string) {
  const [year, month, day] = version.split("-");
  return `${day}/${month}/${year}`;
}

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return <main id="contenido" tabIndex={-1} className="page container legal">
    <nav aria-label="Ruta de navegación" className="breadcrumb"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">{document.title}</span></nav>
    <h1>{document.title}</h1>
    <p className="legal-meta">Versión vigente: {versionDate(document.version)}</p>
    {document.status === "draft" && <Notice><p>Texto preliminar en revisión jurídica. La versión definitiva se publicará antes de la puesta en marcha.</p></Notice>}
    <section className="legal-summary" aria-labelledby="resumen">
      <h2 id="resumen">En resumen</h2>
      <ul>{document.summary.map(item => <li key={item}>{item}</li>)}</ul>
    </section>
    <nav className="legal-toc" aria-label="Contenido del documento">
      <h2>Contenido</h2>
      <ol>{document.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol>
    </nav>
    {document.sections.map(section => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`}>
      <h2 id={`${section.id}-titulo`}>{section.heading}</h2>
      {section.blocks.map((block, index) => "p" in block
        ? <p key={index}>{block.p}</p>
        : <ul key={index}>{block.list.map(item => <li key={item}>{item}</li>)}</ul>)}
    </section>)}
    <p className="legal-back"><Link className="button" href="/registro">Volver al formulario</Link> <span className="legal-meta">Su información capturada se conserva.</span></p>
  </main>;
}
