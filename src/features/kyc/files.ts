import { FILE_EXTENSIONS } from "./fields.ts";

export type FileType = "pdf" | "jpg" | "png";

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Identifica el tipo real por firma binaria; la extensión y el MIME del navegador no son confiables. */
export function detectFileType(bytes: Uint8Array): FileType | null {
  if (bytes.length > 8 && PNG.every((value, index) => bytes[index] === value)) return "png";
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  // Algunos generadores anteponen bytes al encabezado; la especificación admite hasta 1024.
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 1024));
  if (head.includes("%PDF-")) return "pdf";
  return null;
}

export function extensionOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

export function allowedExtension(name: string) {
  return (FILE_EXTENSIONS as readonly string[]).includes(extensionOf(name));
}

/** Nombre apto para mostrar y adjuntar: sin rutas, controles ni caracteres especiales. */
export function safeFileName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? "archivo";
  const clean = base.normalize("NFC").replace(/[^\p{L}\p{N}._ ()-]/gu, "_").replace(/\s+/g, " ").trim();
  return (clean || "archivo").slice(-100);
}

export class BodyTooLargeError extends Error { constructor() { super("body_too_large"); } }

/** Lee el cuerpo completo sin superar maxBytes, aunque no haya Content-Length. */
export async function readLimitedBody(request: Request, maxBytes: number) {
  const declared = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > maxBytes) throw new BodyTooLargeError();
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return body;
}
