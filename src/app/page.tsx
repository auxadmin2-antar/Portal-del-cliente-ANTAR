import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteContent } from "@/content/site";
import { getPublicKycSettings } from "@/config/kyc.server";
import { DOCUMENTS } from "@/features/kyc/fields";
import { KycForm } from "@/features/kyc/ui/kyc-form";
import { formatBytes } from "@/features/kyc/ui/image";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_MX", title: siteContent.intro.title, description: siteContent.description, url: "/", siteName: siteContent.name },
};

export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const settings = getPublicKycSettings();
  return <main id="contenido" tabIndex={-1} className="page container">
    <div className="intro">
      <div>
        <h1>{siteContent.intro.title}</h1>
        <p className="lead">{siteContent.intro.lead}</p>
        <p>{siteContent.intro.steps}</p>
      </div>
      <aside className="checklist" aria-labelledby="checklist-title">
        <h2 id="checklist-title">Tenga a la mano</h2>
        <ul>{DOCUMENTS.map(document => <li key={document.id}>{document.label}{document.required ? "" : " (opcional)"}</li>)}</ul>
        {settings.available && <p>PDF, JPG o PNG. Hasta {formatBytes(settings.maxFileBytes)} por archivo y {formatBytes(settings.maxTotalBytes)} en total.</p>}
      </aside>
    </div>
    {settings.available
      ? <KycForm settings={{ siteKey: settings.siteKey, maxFileBytes: settings.maxFileBytes, maxTotalBytes: settings.maxTotalBytes }} nonce={nonce} draftNote={siteContent.intro.draft} />
      : <Notice tone="error"><p>El formulario no está disponible en este momento. Intente más tarde.</p></Notice>}
  </main>;
}
