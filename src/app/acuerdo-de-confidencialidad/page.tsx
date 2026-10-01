import type { Metadata } from "next";
import { confidentialityAgreement } from "@/content/confidentiality";
import { LegalDocumentView } from "@/components/legal-document";

export const metadata: Metadata = { title: confidentialityAgreement.title, alternates: { canonical: "/acuerdo-de-confidencialidad" } };

export default function ConfidentialityPage() {
  return <LegalDocumentView document={confidentialityAgreement} />;
}
