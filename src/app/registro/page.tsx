import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { siteContent } from "@/content/site";
import { getPublicKycSettings } from "@/config/kyc.server";
import { KycFormLoader } from "@/features/kyc/ui/kyc-form-loader";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = { title: siteContent.form.title, alternates: { canonical: "/registro" } };

export default async function RegistroPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const settings = getPublicKycSettings();
  return <main id="contenido" tabIndex={-1} className="page container">
    <nav aria-label="Ruta de navegación" className="breadcrumb"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">Registro</span></nav>
    <header className="page-head">
      <h1>{siteContent.form.title}</h1>
      <p className="lead">{siteContent.form.lead}</p>
    </header>
    {settings.available
      ? <KycFormLoader settings={{ siteKey: settings.siteKey, maxFileBytes: settings.maxFileBytes, maxTotalBytes: settings.maxTotalBytes }} nonce={nonce} draftNote={siteContent.form.draft} />
      : <Notice tone="error"><p>El formulario no está disponible en este momento. Intente más tarde.</p></Notice>}
  </main>;
}
