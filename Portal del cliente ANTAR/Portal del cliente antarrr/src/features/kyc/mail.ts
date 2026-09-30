import "server-only";
import nodemailer from "nodemailer";
import type { KycConfig } from "@/config/kyc.schema";

type Mail = NonNullable<KycConfig["mail"]>;
export type Delivery = {
  folio: string;
  company: string;
  rfc: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  flagged: number;
  missingDocuments: string[];
  formPdf: Uint8Array;
  documentsPdf: Uint8Array;
};

const oneLine = (value: string, max = 120) => value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

export function composeMessage(mail: Pick<Mail, "from" | "to">, delivery: Delivery) {
  const review = delivery.flagged ? ` [REVISAR ${delivery.flagged}]` : "";
  return {
    from: mail.from,
    to: mail.to,
    replyTo: delivery.contactEmail,
    subject: oneLine(`Alta de cliente${review}: ${delivery.company} (${delivery.rfc}) - ${delivery.folio}`, 200),
    text: [
      `Se recibió un nuevo expediente KYC/CTC.`,
      ``,
      `Folio: ${delivery.folio}`,
      `Empresa: ${oneLine(delivery.company)}`,
      `RFC: ${oneLine(delivery.rfc)}`,
      `Contacto: ${oneLine(delivery.contactName)} · ${oneLine(delivery.contactEmail)} · ${oneLine(delivery.contactPhone)}`,
      delivery.flagged ? `\nAtención: ${delivery.flagged} respuesta(s) requieren revisión de cumplimiento. Consulte el resumen en la primera página del expediente.` : "",
      delivery.missingDocuments.length ? `Documentos opcionales no enviados: ${delivery.missingDocuments.join("; ")}.` : "",
      ``,
      `Adjuntos:`,
      `1. KYC_${delivery.folio}.pdf - información capturada por el cliente.`,
      `2. Documentos_${delivery.folio}.pdf - documentos del cliente en un solo archivo.`,
      ``,
      `Este correo contiene datos personales y confidenciales. No lo reenvíe fuera de las personas autorizadas.`,
    ].filter(line => line !== "").join("\n").replace(/\n{3,}/g, "\n\n"),
    attachments: [
      { filename: `KYC_${delivery.folio}.pdf`, content: Buffer.from(delivery.formPdf), contentType: "application/pdf" },
      { filename: `Documentos_${delivery.folio}.pdf`, content: Buffer.from(delivery.documentsPdf), contentType: "application/pdf" },
    ],
  };
}

export async function sendDelivery(mail: Mail, delivery: Delivery) {
  const transport = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.port === 465,
    requireTLS: mail.port !== 465,
    auth: { user: mail.user, pass: mail.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  try {
    await transport.sendMail(composeMessage(mail, delivery));
  } finally {
    transport.close();
  }
}
