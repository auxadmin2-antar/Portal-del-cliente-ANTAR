import type { Metadata } from "next";
import { privacyNotice } from "@/content/privacy";
import { LegalDocumentView } from "@/components/legal-document";

export const metadata: Metadata = { title: privacyNotice.title, alternates: { canonical: "/aviso-de-privacidad" } };

export default function PrivacyPage() {
  return <LegalDocumentView document={privacyNotice} />;
}
