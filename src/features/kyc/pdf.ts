import { createHash } from "node:crypto";
import { PDFDocument, PDFName, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { DOCUMENTS, SECTIONS, SIGNATURE, flaggedFields, isVisible, type Column, type FieldDef, type KycValues, type TableRow } from "./fields.ts";
import { detectFileType } from "./files.ts";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const WIDTH = A4[0] - MARGIN * 2;
const NAVY = rgb(0.078, 0.157, 0.314);
const INK = rgb(0.11, 0.13, 0.17);
const MUTED = rgb(0.4, 0.43, 0.48);
const LINE = rgb(0.84, 0.86, 0.89);
const BAND = rgb(0.95, 0.96, 0.97);
const ALERT = rgb(0.64, 0.1, 0.1);
const ALERT_BG = rgb(0.99, 0.94, 0.94);

export type Meta = { folio: string; receivedAt: Date };
export type Upload = { name: string; bytes: Uint8Array };
export type AttachmentInfo = { id: string; label: string; file: string | null; pages: number; sha256: string };
export type AttachmentProblem = "invalid" | "encrypted" | "pages";
export class AttachmentError extends Error {
  readonly field: string;
  readonly reason: AttachmentProblem;
  constructor(field: string, reason: AttachmentProblem) {
    super(reason);
    this.field = field;
    this.reason = reason;
  }
}

const MAX_PAGES_PER_FILE = 60;
const MAX_TOTAL_PAGES = 250;

class Writer {
  page!: PDFPage;
  y = 0;
  readonly font: PDFFont;
  readonly bold: PDFFont;
  private readonly doc: PDFDocument;
  private readonly header: string;
  private readonly chars: Set<number>;
  constructor(doc: PDFDocument, font: PDFFont, bold: PDFFont, header: string) {
    this.doc = doc;
    this.font = font;
    this.bold = bold;
    this.header = header;
    this.chars = new Set(font.getCharacterSet());
    this.newPage();
  }

  /** Sustituye caracteres que la fuente estándar no puede codificar. */
  safe(text: string) {
    return Array.from(text.replace(/\t/g, " ").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-"))
      .map(char => (char === "\n" || this.chars.has(char.codePointAt(0) ?? 0) ? char : "?")).join("");
  }

  newPage() {
    this.page = this.doc.addPage(A4);
    this.page.drawText(this.safe(this.header), { x: MARGIN, y: A4[1] - 28, size: 8, font: this.font, color: MUTED });
    this.page.drawLine({ start: { x: MARGIN, y: A4[1] - 34 }, end: { x: A4[0] - MARGIN, y: A4[1] - 34 }, thickness: 0.5, color: LINE });
    this.y = A4[1] - 52;
  }

  need(height: number) { if (this.y - height < MARGIN + 12) this.newPage(); }

  wrap(text: string, font: PDFFont, size: number, width: number) {
    const lines: string[] = [];
    for (const paragraph of text.split("\n")) {
      let line = "";
      for (let word of paragraph.split(/\s+/).filter(Boolean)) {
        while (font.widthOfTextAtSize(word, size) > width) {
          let cut = word.length;
          while (cut > 1 && font.widthOfTextAtSize(word.slice(0, cut), size) > width) cut--;
          if (line) { lines.push(line); line = ""; }
          lines.push(word.slice(0, cut));
          word = word.slice(cut);
        }
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) > width) { lines.push(line); line = word; } else line = candidate;
      }
      lines.push(line);
    }
    return lines;
  }

  text(text: string, options: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; gap?: number } = {}) {
    const { size = 9.5, font = this.font, color = INK, gap = 2.5 } = options;
    for (const line of this.wrap(this.safe(text), font, size, WIDTH)) {
      this.need(size + gap);
      this.y -= size;
      this.page.drawText(line, { x: MARGIN, y: this.y, size, font, color });
      this.y -= gap;
    }
  }

  section(title: string) {
    this.need(90); // evita títulos huérfanos al pie de página
    this.y -= 10;
    this.page.drawRectangle({ x: MARGIN, y: this.y - 20, width: WIDTH, height: 20, color: NAVY });
    this.page.drawText(this.safe(title), { x: MARGIN + 8, y: this.y - 14, size: 10.5, font: this.bold, color: rgb(1, 1, 1) });
    this.y -= 26;
  }

  field(label: string, value: string, flagged = false) {
    const labelWidth = WIDTH * 0.42;
    const valueFont = flagged ? this.bold : this.font;
    const labelLines = this.wrap(this.safe(label), this.font, 8, labelWidth - 8);
    const valueLines = this.wrap(this.safe(value || "-"), valueFont, 9.5, WIDTH - labelWidth - 8);
    const height = Math.max(labelLines.length * 10, valueLines.length * 12) + 9;
    if (height > A4[1] - 2 * MARGIN - 60) {
      // Texto excepcionalmente largo: etiqueta y valor en bloque.
      this.text(label, { size: 8, color: MUTED });
      this.text(value, { size: 9.5, font: valueFont, color: flagged ? ALERT : INK });
      this.rule();
      return;
    }
    this.need(height);
    const top = this.y;
    if (flagged) this.page.drawRectangle({ x: MARGIN, y: top - height, width: WIDTH, height, color: ALERT_BG });
    labelLines.forEach((line, index) => this.page.drawText(line, { x: MARGIN + 4, y: top - 12 - index * 10, size: 8, font: this.font, color: MUTED }));
    valueLines.forEach((line, index) => this.page.drawText(line, { x: MARGIN + labelWidth + 4, y: top - 12.5 - index * 12, size: 9.5, font: valueFont, color: flagged ? ALERT : INK }));
    this.y = top - height;
    this.rule();
  }

  rule() { this.page.drawLine({ start: { x: MARGIN, y: this.y }, end: { x: MARGIN + WIDTH, y: this.y }, thickness: 0.4, color: LINE }); }

  table(label: string, columns: Column[], rows: TableRow[]) {
    this.need(36);
    this.y -= 4;
    this.text(label, { size: 8.5, font: this.bold, color: NAVY });
    this.y -= 2;
    if (!rows.length) { this.text("Sin registros.", { size: 9, color: MUTED }); return; }
    const cellWidth = WIDTH / columns.length;
    const draw = (cells: string[], head: boolean) => {
      const font = head ? this.bold : this.font;
      const lines = cells.map(cell => this.wrap(this.safe(cell), font, 8.5, cellWidth - 8));
      const height = Math.max(...lines.map(list => list.length)) * 11 + 8;
      this.need(height);
      const top = this.y;
      if (head) this.page.drawRectangle({ x: MARGIN, y: top - height, width: WIDTH, height, color: BAND });
      lines.forEach((list, column) => list.forEach((line, index) => this.page.drawText(line, { x: MARGIN + column * cellWidth + 4, y: top - 12 - index * 11, size: 8.5, font, color: INK })));
      this.y = top - height;
      this.rule();
    };
    draw(columns.map(column => column.label), true);
    rows.forEach(row => draw(columns.map(column => formatValue(row[column.id] ?? "", column.type === "date" ? "date" : "text")), false));
    this.y -= 4;
  }
}

function formatValue(value: string, type: FieldDef["type"], field?: FieldDef) {
  if (type === "yesno" || type === "yesnona") return value === "si" ? "Sí" : value === "no" ? "No" : value === "na" ? `N/A${field?.naLabel ? ` (${field.naLabel})` : ""}` : value;
  if (type === "check") return value === "on" ? "Aceptado" : "No aceptado";
  if (type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value.split("-").reverse().join("/");
  return value;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short", timeZone: "America/Mexico_City" }).format(date) + " (hora del centro de México)";
}

/** Pie con folio y paginación. En el PDF de documentos solo va en páginas propias, nunca sobre las del cliente. */
function footers(doc: PDFDocument, font: PDFFont, folio: string, only?: Set<PDFPage>) {
  const pages = doc.getPages();
  pages.forEach((page, index) => {
    if (only && !only.has(page)) return;
    page.drawText(`Folio ${folio}  ·  Página ${index + 1} de ${pages.length}`, { x: MARGIN, y: 24, size: 8, font, color: MUTED });
  });
}

async function setup(title: string, header: string) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setCreator("Portal de alta de clientes");
  doc.setProducer("Portal de alta de clientes");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  return { doc, font, bold, writer: new Writer(doc, font, bold, header) };
}

/** PDF 1: expediente KYC/CTC con la información capturada. */
export async function buildFormPdf(values: KycValues, meta: Meta, attachments: AttachmentInfo[]) {
  const { doc, font, bold, writer } = await setup(`Expediente KYC-CTC ${meta.folio}`, "Expediente KYC / CTC · Documento confidencial");
  const text = (id: string) => (typeof values[id] === "string" ? values[id] as string : "");

  writer.text("EXPEDIENTE DE ALTA DE CLIENTE", { size: 17, font: bold, color: NAVY, gap: 5 });
  writer.text("Formato KYC / CTC unificado", { size: 10, color: MUTED, gap: 8 });
  writer.field("Folio", meta.folio);
  writer.field("Recibido", formatDateTime(meta.receivedAt));
  writer.field("Empresa", text("razon_social"));
  writer.field("RFC", text("rfc"));
  writer.field("Lugar", text("lugar"));

  const flagged = flaggedFields(values);
  writer.section("Resumen para cumplimiento");
  if (!flagged.length) writer.text("Ninguna respuesta requiere revisión adicional.", { size: 9.5 });
  else {
    writer.text(`${flagged.length} respuesta(s) requieren revisión:`, { size: 9.5, font: bold, color: ALERT });
    flagged.forEach(field => writer.text(`• ${field.label}: ${formatValue(text(field.id), field.type)}`, { size: 9, color: ALERT }));
  }
  const missing = attachments.filter(item => !item.file);
  if (missing.length) writer.text(`Documentos no enviados: ${missing.map(item => item.label).join("; ")}.`, { size: 9, color: MUTED });

  SECTIONS.forEach((section, index) => {
    writer.section(`${index + 1}. ${section.title}`);
    let printed = 0;
    for (const field of section.fields) {
      if (!isVisible(field, values)) continue;
      if (field.type === "table") { writer.table(field.label, field.columns ?? [], values[field.id] as TableRow[]); printed++; continue; }
      const value = text(field.id);
      if (!value && !field.required) continue;
      writer.field(field.label, formatValue(value, field.type, field), Boolean(field.flagOn && value === field.flagOn));
      printed++;
    }
    if (!printed) writer.text("Sin información.", { size: 9, color: MUTED });
  });

  writer.section(`${SECTIONS.length + 1}. Documentos anexos`);
  for (const item of attachments) {
    writer.field(item.label, item.file ? `${item.file} · ${item.pages} pág. · SHA-256 ${item.sha256.slice(0, 16)}…` : "No enviado");
  }

  writer.section(`${SECTIONS.length + 2}. Declaración y aceptación`);
  for (const field of SIGNATURE) writer.field(field.label, formatValue(text(field.id), field.type));
  writer.field("Fecha de aceptación", formatDateTime(meta.receivedAt));
  writer.y -= 6;
  writer.text("Aceptación electrónica realizada en el portal de alta de clientes. No sustituye la firma autógrafa cuando el proceso interno la requiera.", { size: 8, color: MUTED });

  footers(doc, font, meta.folio);
  return doc.save();
}

/** PDF 2: une los documentos del cliente con una portada por documento. */
export async function buildAttachmentsPdf(files: Record<string, Upload | undefined>, meta: Meta) {
  const { doc, font, bold, writer } = await setup(`Documentos ${meta.folio}`, `Documentos del cliente · Folio ${meta.folio} · Confidencial`);
  const info: AttachmentInfo[] = [];
  const index = writer.page;
  const own = new Set<PDFPage>([index]);
  writer.text("DOCUMENTOS DEL CLIENTE", { size: 17, font: bold, color: NAVY, gap: 10 });
  const entries: string[] = [];
  let totalPages = 0;

  for (const definition of DOCUMENTS) {
    const upload = files[definition.id];
    if (!upload) { info.push({ id: definition.id, label: definition.label, file: null, pages: 0, sha256: "" }); continue; }
    const type = detectFileType(upload.bytes);
    if (!type) throw new AttachmentError(definition.id, "invalid");
    const sha256 = createHash("sha256").update(upload.bytes).digest("hex");
    let source: PDFDocument | null = null;
    if (type === "pdf") {
      let count: number;
      try {
        source = await PDFDocument.load(upload.bytes, { updateMetadata: false });
        count = source.getPageCount();
      } catch (error) {
        throw new AttachmentError(definition.id, error instanceof Error && /encrypt/i.test(error.message) ? "encrypted" : "invalid");
      }
      if (count < 1 || count > MAX_PAGES_PER_FILE || totalPages + count > MAX_TOTAL_PAGES) throw new AttachmentError(definition.id, "pages");
    }

    const startPage = doc.getPageCount() + 1;
    const cover = doc.addPage(A4);
    own.add(cover);
    cover.drawText(writer.safe(definition.label), { x: MARGIN, y: A4[1] / 2 + 24, size: 15, font: bold, color: NAVY, maxWidth: WIDTH, lineHeight: 19 });
    cover.drawText(writer.safe(`Archivo: ${upload.name}`), { x: MARGIN, y: A4[1] / 2 - 8, size: 10, font, color: INK, maxWidth: WIDTH });
    cover.drawText(`SHA-256: ${sha256}`, { x: MARGIN, y: A4[1] / 2 - 24, size: 7.5, font, color: MUTED });

    let pages = 1;
    try {
      if (source) {
        const copied = await doc.copyPages(source, source.getPageIndices());
        for (const page of copied) {
          // Elimina anotaciones y acciones (enlaces, JavaScript, formularios) del documento recibido.
          page.node.delete(PDFName.of("Annots"));
          page.node.delete(PDFName.of("AA"));
          doc.addPage(page);
        }
        pages = copied.length;
      } else {
        const image = type === "png" ? await doc.embedPng(upload.bytes) : await doc.embedJpg(upload.bytes);
        const page = doc.addPage(A4);
        own.add(page);
        const scale = Math.min(WIDTH / image.width, (A4[1] - MARGIN * 2) / image.height, 1);
        page.drawImage(image, { x: (A4[0] - image.width * scale) / 2, y: (A4[1] - image.height * scale) / 2, width: image.width * scale, height: image.height * scale });
      }
    } catch {
      throw new AttachmentError(definition.id, "invalid");
    }
    totalPages += pages;
    entries.push(`${definition.label} · ${pages} pág. · desde la página ${startPage}`);
    info.push({ id: definition.id, label: definition.label, file: upload.name, pages, sha256 });
  }

  for (const entry of entries) {
    const lines = writer.wrap(writer.safe(entry), font, 9.5, WIDTH);
    for (const line of lines) { writer.y -= 14; index.drawText(line, { x: MARGIN, y: writer.y, size: 9.5, font, color: INK }); }
  }
  footers(doc, font, meta.folio, own);
  return { bytes: await doc.save(), info };
}
