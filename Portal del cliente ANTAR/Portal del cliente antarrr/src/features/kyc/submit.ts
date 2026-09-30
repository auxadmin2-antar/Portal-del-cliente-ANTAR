import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { readSiteConfig } from "@/config/site";
import { getKycConfig } from "@/config/kyc.server";
import type { KycConfig } from "@/config/kyc.schema";
import { DOCUMENTS, flaggedFields, type KycValues } from "./fields.ts";
import { validateKyc } from "./validation.ts";
import { BodyTooLargeError, allowedExtension, detectFileType, readLimitedBody, safeFileName } from "./files.ts";
import { AttachmentError, buildAttachmentsPdf, buildFormPdf, type Upload } from "./pdf.ts";
import { clientKey, isRateLimited, isSameOrigin, previousSubmission, rememberSubmission, verifyCaptcha } from "./security.ts";
import { sendDelivery } from "./mail.ts";

export type SubmitErrorCode =
  | "unavailable" | "forbidden" | "unsupported" | "too_large" | "rate_limited" | "captcha"
  | "invalid" | "validation" | "delivery_failed" | "server";

const FORM_OVERHEAD = 512 * 1024; // JSON del formulario y cabeceras multipart
const MIN_FILL_MS = 5_000;
const ALLOWED_FIELDS = new Set(["data", "captcha", "startedAt", "hp_confirm", ...DOCUMENTS.map(document => document.id)]);

class SubmitError extends Error {
  readonly status: number;
  readonly code: SubmitErrorCode;
  readonly fields?: Record<string, string>;
  constructor(status: number, code: SubmitErrorCode, fields?: Record<string, string>) {
    super(code);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function log(event: string, details: Record<string, unknown> = {}) {
  // Nunca registrar valores del formulario ni nombres de archivos: contienen datos personales.
  console.info(JSON.stringify({ scope: "kyc", event, ...details }));
}

function newFolio(now: Date) {
  const day = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `KYC-${day}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

async function readUploads(form: FormData, config: KycConfig) {
  for (const key of new Set(form.keys())) if (!ALLOWED_FIELDS.has(key)) throw new SubmitError(400, "invalid");
  const files: Record<string, Upload> = {};
  const errors: Record<string, string> = {};
  let total = 0;
  for (const definition of DOCUMENTS) {
    const entries = form.getAll(definition.id);
    if (entries.length > 1) throw new SubmitError(400, "invalid");
    const entry = entries[0];
    if (entry === undefined || (entry instanceof File && entry.size === 0)) {
      if (definition.required) errors[definition.id] = "Adjunte este documento.";
      continue;
    }
    if (!(entry instanceof File)) throw new SubmitError(400, "invalid");
    total += entry.size;
    if (entry.size > config.limits.maxFileBytes) { errors[definition.id] = "El archivo supera el tamaño permitido."; continue; }
    if (!allowedExtension(entry.name)) { errors[definition.id] = "Formato no permitido. Use PDF, JPG o PNG."; continue; }
    const bytes = new Uint8Array(await entry.arrayBuffer());
    if (!detectFileType(bytes)) { errors[definition.id] = "El contenido del archivo no corresponde a un PDF, JPG o PNG."; continue; }
    files[definition.id] = { name: safeFileName(entry.name), bytes };
  }
  if (total > config.limits.maxTotalBytes) throw new SubmitError(413, "too_large");
  return { files, errors };
}

function fingerprint(values: KycValues, files: Record<string, Upload>) {
  const hash = createHash("sha256").update(JSON.stringify(values));
  for (const id of Object.keys(files).sort()) hash.update(id).update(createHash("sha256").update(files[id]!.bytes).digest());
  return hash.digest("hex");
}

async function writeLocalCopies(dir: string, folio: string, formPdf: Uint8Array, documentsPdf: Uint8Array) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `KYC_${folio}.pdf`), formPdf);
  await writeFile(path.join(dir, `Documentos_${folio}.pdf`), documentsPdf);
}

export async function handleKycSubmission(request: Request): Promise<Response> {
  const requestId = randomBytes(6).toString("hex");
  try {
    let config: KycConfig;
    try { config = getKycConfig(); } catch { throw new SubmitError(503, "unavailable"); }

    if (!isSameOrigin(request, readSiteConfig(process.env).origin)) throw new SubmitError(403, "forbidden");
    if (!/^multipart\/form-data;\s*boundary=/i.test(request.headers.get("content-type") ?? "")) throw new SubmitError(415, "unsupported");

    const client = clientKey(request.headers, config.trustProxy);
    if (isRateLimited(client, config.rateLimitPerHour)) throw new SubmitError(429, "rate_limited");

    let form: FormData;
    try {
      const body = await readLimitedBody(request, config.limits.maxTotalBytes + FORM_OVERHEAD);
      form = await new Response(body, { headers: { "content-type": request.headers.get("content-type")! } }).formData();
    } catch (error) {
      if (error instanceof BodyTooLargeError) throw new SubmitError(413, "too_large");
      throw new SubmitError(400, "invalid");
    }

    if (form.get("hp_confirm")) throw new SubmitError(400, "invalid");
    const startedAt = Number(form.get("startedAt"));
    if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) throw new SubmitError(400, "invalid");

    if (config.captcha) {
      const token = form.get("captcha");
      if (typeof token !== "string" || !(await verifyCaptcha(config.captcha.secret, token, client))) throw new SubmitError(400, "captcha");
    }

    const raw = form.get("data");
    if (typeof raw !== "string" || raw.length > FORM_OVERHEAD) throw new SubmitError(400, "invalid");
    let data: unknown;
    try { data = JSON.parse(raw); } catch { throw new SubmitError(400, "invalid"); }

    const { values, errors } = validateKyc(data);
    const uploads = await readUploads(form, config);
    Object.assign(errors, uploads.errors);
    if (Object.keys(errors).length) throw new SubmitError(422, "validation", errors);

    const print = fingerprint(values, uploads.files);
    const duplicate = previousSubmission(print);
    if (duplicate) { log("duplicate", { requestId, folio: duplicate }); return reply(200, { ok: true, folio: duplicate }); }

    const receivedAt = new Date();
    const folio = newFolio(receivedAt);
    let attachments: Awaited<ReturnType<typeof buildAttachmentsPdf>>;
    try { attachments = await buildAttachmentsPdf(uploads.files, { folio, receivedAt }); }
    catch (error) {
      if (!(error instanceof AttachmentError)) throw error;
      const message = error.reason === "encrypted" ? "El PDF está protegido con contraseña. Envíe una versión sin protección."
        : error.reason === "pages" ? "El documento tiene demasiadas páginas." : "No pudimos leer este archivo. Verifique que no esté dañado.";
      throw new SubmitError(422, "validation", { [error.field]: message });
    }
    const formPdf = await buildFormPdf(values, { folio, receivedAt }, attachments.info);
    const text = (id: string) => values[id] as string;
    const delivery = {
      folio, company: text("razon_social"), rfc: text("rfc"),
      contactName: text("contacto_nombre"), contactEmail: text("contacto_email"), contactPhone: text("contacto_tel"),
      flagged: flaggedFields(values).length,
      missingDocuments: attachments.info.filter(item => !item.file).map(item => item.label),
      formPdf, documentsPdf: attachments.bytes,
    };

    if (config.dryRun) {
      if (config.outputDir) await writeLocalCopies(config.outputDir, folio, formPdf, attachments.bytes);
      log("dry_run", { requestId, folio, formBytes: formPdf.byteLength, documentBytes: attachments.bytes.byteLength });
    } else {
      try { await sendDelivery(config.mail!, delivery); }
      catch (error) {
        log("delivery_failed", { requestId, folio, error: error instanceof Error ? error.name : "unknown" });
        throw new SubmitError(502, "delivery_failed");
      }
      log("delivered", { requestId, folio, flagged: delivery.flagged });
    }
    rememberSubmission(print, folio);
    return reply(200, { ok: true, folio });
  } catch (error) {
    if (error instanceof SubmitError) {
      if (error.status >= 500 || error.status === 429 || error.status === 403) log("rejected", { requestId, code: error.code });
      return reply(error.status, { ok: false, error: error.code, fields: error.fields });
    }
    log("error", { requestId, error: error instanceof Error ? error.name : "unknown" });
    return reply(500, { ok: false, error: "server" });
  }
}
