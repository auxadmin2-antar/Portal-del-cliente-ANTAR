// Conserva el formulario mientras la pestaña esté abierta.
// - Memoria del módulo: valores, paso y ARCHIVOS; sobrevive a la navegación dentro del portal
//   (los enlaces internos no recargan la página).
// - sessionStorage: solo texto y paso; sobrevive a una recarga y se borra al cerrar la pestaña.
// Los archivos nunca se escriben en disco para no dejar documentos sensibles en el equipo.
// Este módulo solo se ejecuta en el navegador (el formulario se carga sin render de servidor).
import { ALL_FIELDS, type KycValue, type KycValues } from "../fields.ts";

export type FormSnapshot = { values: KycValues; files: Record<string, File | undefined>; step: number; visited: number };

const KEY = "kyc-draft-v2";
let memory: FormSnapshot | null = null;

function fromStorage(maxStep: number, base: KycValues): FormSnapshot | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { values?: Record<string, unknown>; step?: unknown; visited?: unknown };
    const values = { ...base };
    for (const field of ALL_FIELDS) {
      const value = parsed.values?.[field.id];
      if (field.type === "table" ? Array.isArray(value) : typeof value === "string") values[field.id] = value as KycValue;
    }
    const clamp = (value: unknown) => (typeof value === "number" && value >= 0 ? Math.min(Math.floor(value), maxStep) : 0);
    const step = clamp(parsed.step);
    return { values, files: {}, step, visited: Math.max(step, clamp(parsed.visited)) };
  } catch {
    return null;
  }
}

/** Estado guardado en esta pestaña, o null si no hay. maxStep limita el paso restaurado sin archivos. */
export function restoreForm(maxStep: number, base: KycValues): FormSnapshot | null {
  return memory ?? fromStorage(maxStep, base);
}

export function saveForm(snapshot: FormSnapshot, maxStoredStep: number) {
  memory = snapshot;
  try {
    const step = Math.min(snapshot.step, maxStoredStep);
    window.sessionStorage.setItem(KEY, JSON.stringify({ values: snapshot.values, step, visited: Math.min(snapshot.visited, maxStoredStep) }));
  } catch { /* Almacenamiento no disponible o lleno: queda la memoria. */ }
}

export function clearForm() {
  memory = null;
  try {
    window.sessionStorage.removeItem(KEY);
    window.sessionStorage.removeItem("kyc-draft-v1");
  } catch { /* Almacenamiento no disponible. */ }
}
