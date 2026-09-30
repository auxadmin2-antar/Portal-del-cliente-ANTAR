import { z } from "zod";
import { ALL_FIELDS, LIMITS, isVisible, type Column, type FieldDef, type KycValues, type TableRow } from "./fields.ts";

export type ValidationResult = { ok: boolean; values: KycValues; errors: Record<string, string> };

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g;

function toText(raw: unknown, multiline: boolean) {
  if (typeof raw === "number" && Number.isFinite(raw)) raw = String(raw);
  if (typeof raw !== "string") return "";
  let text = raw.replace(CONTROL, "").replace(/\r\n?/g, "\n");
  if (!multiline) text = text.replace(/\s*\n\s*/g, " ");
  return text.trim();
}

export function isValidDate(value: string) {
  if (!z.iso.date().safeParse(value).success) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return date.getUTCFullYear() >= 1900 && date.getTime() <= Date.now() + 86_400_000;
}

const date = z.string().refine(isValidDate, "Escriba una fecha válida que no sea futura.");

function schemaFor(field: FieldDef): z.ZodType<string> {
  switch (field.type) {
    case "textarea": return z.string().max(LIMITS.textarea, `Máximo ${LIMITS.textarea} caracteres.`);
    case "date": return date;
    case "email": return z.email("Escriba un correo electrónico válido.").max(LIMITS.text);
    case "tel": return z.string().regex(/^[0-9+()\s.,/-]{7,60}$/, "Escriba un teléfono válido.");
    case "number": return z.string().regex(/^\d{1,9}$/, "Escriba un número entero.").refine(value => {
      const number = Number(value);
      return number >= (field.min ?? 0) && number <= (field.max ?? Number.MAX_SAFE_INTEGER);
    }, "Escriba un número dentro del rango permitido.");
    case "yesno": return z.enum(["si", "no"], "Seleccione Sí o No.");
    case "yesnona": return z.enum(["si", "no", "na"], "Seleccione una opción.");
    case "check": return z.literal("on", "Debe aceptar para continuar.");
    default: {
      let text = z.string().max(LIMITS.text, `Máximo ${LIMITS.text} caracteres.`);
      if (field.pattern) text = text.regex(new RegExp(field.pattern, "i"), field.message ?? "Formato inválido.");
      return text;
    }
  }
}

function cellError(column: Column, value: string) {
  if (value.length > LIMITS.tableCell) return `${column.label}: máximo ${LIMITS.tableCell} caracteres.`;
  if (column.type === "date" && !isValidDate(value)) return `${column.label}: escriba una fecha válida.`;
  if (column.type === "percent" && !(/^\d{1,3}(\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 100)) {
    return `${column.label}: escriba un porcentaje mayor que 0 y hasta 100.`;
  }
  return null;
}

function validateTable(field: FieldDef, raw: unknown): { rows: TableRow[]; error?: string } {
  const columns = field.columns ?? [];
  const input = Array.isArray(raw) ? raw : [];
  if (input.length > LIMITS.tableRows) return { rows: [], error: `Máximo ${LIMITS.tableRows} registros.` };
  const rows: TableRow[] = [];
  let error: string | undefined;
  for (const item of input) {
    const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const row: TableRow = Object.fromEntries(columns.map(column => [column.id, toText(source[column.id], false)]));
    if (!columns.some(column => row[column.id])) continue; // fila vacía
    rows.push(row);
    for (const column of columns) {
      const value = row[column.id] ?? "";
      const problem = value ? cellError(column, value) : `Registro ${rows.length}: complete ${column.label.toLowerCase()}.`;
      if (problem && !error) error = problem;
    }
  }
  if (!error && field.required && rows.length === 0) error = "Agregue al menos un registro.";
  const percent = columns.find(column => column.type === "percent");
  if (!error && percent) {
    const total = rows.reduce((sum, row) => sum + Number(row[percent.id] || 0), 0);
    if (total > 100.001) error = `La suma de ${percent.label.toLowerCase()} no puede superar 100 %.`;
  }
  return { rows, error };
}

/** Normaliza y valida un expediente. Ignora claves desconocidas; los campos ocultos quedan vacíos. */
export function validateKyc(input: unknown): ValidationResult {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const values: KycValues = {};
  const errors: Record<string, string> = {};

  for (const field of ALL_FIELDS) {
    if (field.type === "table") continue;
    const text = toText(source[field.id], field.type === "textarea");
    values[field.id] = field.uppercase ? text.toUpperCase() : text;
  }

  for (const field of ALL_FIELDS) {
    if (!isVisible(field, values)) {
      values[field.id] = field.type === "table" ? [] : "";
      continue;
    }
    if (field.type === "table") {
      const { rows, error } = validateTable(field, source[field.id]);
      values[field.id] = rows;
      if (error) errors[field.id] = error;
      continue;
    }
    const value = values[field.id] as string;
    if (!value) {
      if (field.required) errors[field.id] = field.type === "check" ? "Debe aceptar para continuar." : "Este dato es obligatorio.";
      continue;
    }
    const parsed = schemaFor(field).safeParse(value);
    if (!parsed.success) errors[field.id] = parsed.error.issues[0]?.message ?? "Dato inválido.";
  }

  return { ok: Object.keys(errors).length === 0, values, errors };
}
