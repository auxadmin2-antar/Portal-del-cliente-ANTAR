import type { Metadata } from "next";
import { privacyNotice } from "@/content/privacy";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = { title: privacyNotice.title, alternates: { canonical: "/aviso-de-privacidad" } };

export default function PrivacyPage() {
  return <main id="contenido" tabIndex={-1} className="page container prose">
    <h1>{privacyNotice.title}</h1>
    {privacyNotice.status === "draft" && <Notice><p>Texto preliminar en revisión. La versión definitiva se publicará antes de la puesta en marcha.</p></Notice>}
    {privacyNotice.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
  </main>;
}
