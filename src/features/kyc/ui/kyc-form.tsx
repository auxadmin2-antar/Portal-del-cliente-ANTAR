"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ALL_FIELDS, DOCUMENTS, SECTIONS, SIGNATURE, emptyValues, isVisible, plainLabel, type KycValue, type KycValues, type TableRow } from "../fields.ts";
import { validateKyc } from "../validation.ts";
import { allowedExtension, detectFileType } from "../files.ts";
import { FieldInput, focusTarget } from "./field-input";
import { emptyRow } from "./table-input";
import { DocumentsStep } from "./documents-step";
import { ReviewStep } from "./review-step";
import { Turnstile } from "./turnstile";
import { formatBytes, shrinkImage } from "./image";
import { clearForm, restoreForm, saveForm } from "./form-memory";

export type KycFormSettings = { siteKey: string | null; maxFileBytes: number; maxTotalBytes: number };
type Props = { settings: KycFormSettings; nonce?: string; draftNote: string };
type Files = Record<string, File | undefined>;
type Errors = Record<string, string>;

const DOCUMENTS_STEP = SECTIONS.length;
const REVIEW_STEP = SECTIONS.length + 1;
const STEPS = [...SECTIONS.map(section => ({ title: section.title, description: section.description })),
  { title: "Documentos", description: "Adjunte cada documento en PDF, JPG o PNG. Las fotografías grandes se reducen automáticamente." },
  { title: "Revisión y envío", description: "Revise su información. Puede volver a cualquier sección con «Editar»." }];
const IMAGE_SHRINK_FROM = 700 * 1024;
const LABELS: Record<string, string> = {
  ...Object.fromEntries(ALL_FIELDS.map(field => [field.id, plainLabel(field.label)])),
  ...Object.fromEntries(DOCUMENTS.map(document => [document.id, document.label])),
  captcha: "Verificación de seguridad",
};

function initialValues(): KycValues {
  const values = emptyValues();
  for (const field of ALL_FIELDS) if (field.type === "table" && field.required) values[field.id] = [emptyRow(field)];
  return values;
}

function pick(errors: Errors, ids: string[]) {
  return Object.fromEntries(ids.filter(id => errors[id]).map(id => [id, errors[id]!]));
}

function serverMessage(code: string, maxTotalBytes: number) {
  switch (code) {
    case "validation": return "Revise los datos marcados e intente de nuevo.";
    case "too_large": return `Los archivos superan el límite de ${formatBytes(maxTotalBytes)}. Reduzca su tamaño (por ejemplo, escaneando a menor resolución) e intente de nuevo.`;
    case "rate_limited": return "Recibimos demasiados intentos desde su conexión. Espere una hora e intente de nuevo.";
    case "captcha": return "No pudimos completar la verificación de seguridad. Vuelva a realizarla y envíe de nuevo.";
    case "unavailable": return "El formulario no está disponible temporalmente. Sus datos siguen aquí; intente más tarde.";
    case "forbidden": case "invalid": case "unsupported": return "No pudimos procesar la solicitud. Recargue la página e intente de nuevo.";
    default: return "No pudimos enviar su información. Sus datos siguen en el formulario; intente de nuevo en unos minutos.";
  }
}

export function KycForm({ settings, nonce, draftNote }: Props) {
  // Se ejecuta solo en el navegador: restaura lo capturado en esta pestaña.
  const [restored] = useState(() => restoreForm(DOCUMENTS_STEP, initialValues()));
  const [values, setValues] = useState<KycValues>(() => restored?.values ?? initialValues());
  const [files, setFiles] = useState<Files>(() => restored?.files ?? {});
  const [step, setStep] = useState(() => restored?.step ?? 0);
  const [visited, setVisited] = useState(() => restored?.visited ?? 0);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [folio, setFolio] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [focusRequest, setFocusRequest] = useState<{ target: "heading" | "summary" | "result"; id: number } | null>(null);

  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  // Guarda en cada cambio; los archivos solo en memoria (ver form-memory.ts).
  useEffect(() => {
    if (folio) return;
    saveForm({ values, files, step, visited }, DOCUMENTS_STEP);
  }, [values, files, step, visited, folio]);

  useEffect(() => {
    if (!focusRequest) return;
    const element = focusRequest.target === "heading" ? heading.current : focusRequest.target === "summary" ? summary.current : result.current;
    element?.focus();
    if (focusRequest.target === "heading" && panel.current && panel.current.getBoundingClientRect().top < 0) panel.current.scrollIntoView({ block: "start" });
  }, [focusRequest]);

  const requestFocus = (target: "heading" | "summary" | "result") => setFocusRequest(previous => ({ target, id: (previous?.id ?? 0) + 1 }));

  const update = useCallback((id: string, value: KycValue) => {
    setValues(previous => ({ ...previous, [id]: value }));
    setErrors(previous => {
      if (!previous[id]) return previous;
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }, []);

  function errorsFor(target: number): Errors {
    if (target < DOCUMENTS_STEP) return pick(validateKyc(values).errors, SECTIONS[target]!.fields.map(field => field.id));
    if (target === DOCUMENTS_STEP) {
      return Object.fromEntries(DOCUMENTS.filter(document => document.required && !files[document.id]).map(document => [document.id, "Adjunte este documento."]));
    }
    const found = pick(validateKyc(values).errors, SIGNATURE.map(field => field.id));
    if (settings.siteKey && !captchaToken) found.captcha = "Complete la verificación de seguridad.";
    return found;
  }

  function goTo(target: number) {
    setStep(target);
    setVisited(previous => Math.max(previous, target));
    setErrors({});
    setFormError(null);
    requestFocus("heading");
  }

  function showErrors(found: Errors, message: string | null = null) {
    setErrors(found);
    setFormError(message);
    requestFocus("summary");
  }

  function next() {
    const found = errorsFor(step);
    if (Object.keys(found).length) return showErrors(found);
    goTo(step + 1);
  }

  async function selectFile(id: string, selected: File) {
    const fail = (message: string) => setErrors(previous => ({ ...previous, [id]: message }));
    setErrors(previous => { const nextErrors = { ...previous }; delete nextErrors[id]; return nextErrors; });
    if (!allowedExtension(selected.name)) return fail("Formato no permitido. Use PDF, JPG o PNG.");
    const type = detectFileType(new Uint8Array(await selected.slice(0, 1024).arrayBuffer()));
    if (!type) return fail("El contenido del archivo no corresponde a un PDF, JPG o PNG.");
    let file = selected;
    if (type !== "pdf" && selected.size > IMAGE_SHRINK_FROM) {
      setProcessing(id);
      try { file = await shrinkImage(selected); } catch { /* Se conserva el original. */ } finally { setProcessing(null); }
    }
    if (file.size > settings.maxFileBytes) return fail(`El archivo pesa ${formatBytes(file.size)}; el máximo por archivo es ${formatBytes(settings.maxFileBytes)}.`);
    const others = Object.entries(files).reduce((sum, [key, current]) => sum + (key === id ? 0 : current?.size ?? 0), 0);
    if (others + file.size > settings.maxTotalBytes) {
      return fail(`Con este archivo el total sería ${formatBytes(others + file.size)} y el máximo es ${formatBytes(settings.maxTotalBytes)}. Reduzca el tamaño del archivo.`);
    }
    setFiles(previous => ({ ...previous, [id]: file }));
  }

  function startOver() {
    if (!window.confirm("¿Borrar toda la información capturada y los archivos adjuntos?")) return;
    clearForm();
    reset();
  }

  async function submit() {
    for (let target = 0; target <= REVIEW_STEP; target++) {
      const found = errorsFor(target);
      if (Object.keys(found).length) {
        if (target !== step) { setStep(target); setVisited(previous => Math.max(previous, target)); }
        return showErrors(found, target !== step ? "Falta información en esta sección." : null);
      }
    }
    setSending(true);
    setFormError(null);
    const body = new FormData();
    body.set("data", JSON.stringify(values));
    body.set("startedAt", String(startedAt.current));
    body.set("hp_confirm", honeypot.current?.value ?? "");
    if (captchaToken) body.set("captcha", captchaToken);
    for (const document of DOCUMENTS) { const file = files[document.id]; if (file) body.set(document.id, file, file.name); }
    try {
      const response = await fetch("/api/kyc", { method: "POST", body, signal: AbortSignal.timeout(90_000) });
      const data = await response.json().catch(() => null) as { ok?: boolean; folio?: string; error?: string; fields?: Errors } | null;
      if (response.ok && data?.ok && data.folio) {
        clearForm();
        setFolio(data.folio);
        requestFocus("result");
        return;
      }
      const code = data?.error ?? "server";
      if (code === "captcha") { setCaptchaToken(""); setCaptchaKey(key => key + 1); }
      if (code === "validation" && data?.fields) {
        const target = SECTIONS.findIndex(section => section.fields.some(field => data.fields![field.id]));
        const destination = target >= 0 ? target : DOCUMENTS.some(document => data.fields![document.id]) ? DOCUMENTS_STEP : REVIEW_STEP;
        setStep(destination);
        return showErrors(data.fields, serverMessage(code, settings.maxTotalBytes));
      }
      showErrors({}, serverMessage(code, settings.maxTotalBytes));
    } catch {
      showErrors({}, serverMessage("server", settings.maxTotalBytes));
    } finally {
      setSending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || processing) return;
    if (step < REVIEW_STEP) next();
    else void submit();
  }

  function reset() {
    setValues(initialValues());
    setFiles({});
    setStep(0);
    setVisited(0);
    setErrors({});
    setFormError(null);
    setFolio(null);
    setCaptchaToken("");
    setCaptchaKey(key => key + 1);
    startedAt.current = Date.now();
    requestFocus("heading");
  }

  if (folio) {
    return <section className="kyc-panel result" aria-labelledby="result-title">
      <h2 id="result-title" ref={result} tabIndex={-1}>Recibimos su información</h2>
      <p>Su expediente y sus documentos se enviaron correctamente. Este es su folio:</p>
      <p className="folio">{folio}</p>
      <p>Conserve este número para cualquier aclaración. Nuestro equipo revisará su expediente y se comunicará al correo de contacto que registró.</p>
      <Button variant="secondary" onClick={reset}>Registrar otra empresa</Button>
    </section>;
  }

  const current = STEPS[step]!;
  const errorEntries = Object.entries(errors);
  const onField = step < DOCUMENTS_STEP ? SECTIONS[step]!.fields.filter(field => isVisible(field, values)) : [];

  return <div className="kyc">
    <nav className="kyc-steps" aria-label="Secciones del formulario">
      <h2>Secciones</h2>
      <ol>
        {STEPS.map((item, index) => <li key={item.title}>
          <button type="button" disabled={index > visited || sending} aria-current={index === step ? "step" : undefined} data-done={index < visited && index !== step ? true : undefined} onClick={() => goTo(index)}>{item.title}{index < visited && index !== step && <span className="visually-hidden"> (visitado)</span>}</button>
        </li>)}
      </ol>
    </nav>

    <div className="kyc-panel" ref={panel}>

      <div className="kyc-progress">
        <span>Paso {step + 1} de {STEPS.length}</span>
        <progress max={STEPS.length} value={step + 1} aria-label={`Paso ${step + 1} de ${STEPS.length}`} />
      </div>
      <h2 ref={heading} tabIndex={-1}>{current.title}</h2>
      {current.description && <p className="kyc-description">{current.description}</p>}

      {(formError || errorEntries.length > 0) && <Notice tone="error" ref={summary}>
        <p><strong>{formError ?? "Revise los siguientes datos:"}</strong></p>
        {errorEntries.length > 0 && <ul>
          {errorEntries.map(([id, message]) => {
            const field = ALL_FIELDS.find(item => item.id === id);
            return <li key={id}><a href={`#${field ? focusTarget(field) : `f-${id}`}`}>{LABELS[id] ?? id}</a>: {message}</li>;
          })}
        </ul>}
      </Notice>}

      <form noValidate onSubmit={onSubmit} aria-busy={sending}>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="hp_confirm">No llene este campo</label>
          <input id="hp_confirm" name="hp_confirm" ref={honeypot} tabIndex={-1} autoComplete="off" />
        </div>

        {step < DOCUMENTS_STEP && <div className="kyc-fields">
          {onField.map(field => <FieldInput key={field.id} field={field} value={values[field.id] ?? (field.type === "table" ? [] as TableRow[] : "")} error={errors[field.id]} onChange={update} />)}
        </div>}

        {step === DOCUMENTS_STEP && <DocumentsStep files={files} errors={errors} processing={processing}
          maxFileBytes={settings.maxFileBytes} maxTotalBytes={settings.maxTotalBytes}
          onSelect={(id, file) => void selectFile(id, file)}
          onRemove={id => setFiles(previous => { const nextFiles = { ...previous }; delete nextFiles[id]; return nextFiles; })} />}

        {step === REVIEW_STEP && <>
          <ReviewStep values={values} files={files} onEdit={goTo} documentsStep={DOCUMENTS_STEP} />
          <div className="signature">
            <h3>Declaración y envío</h3>
            <div className="kyc-fields">
              {SIGNATURE.map(field => <FieldInput key={field.id} field={field} value={values[field.id] ?? ""} error={errors[field.id]} onChange={update} />)}
            </div>
            {settings.siteKey && <div>
              <Turnstile key={captchaKey} siteKey={settings.siteKey} nonce={nonce} onToken={setCaptchaToken} />
              {errors.captcha && <p className="field-error">{errors.captcha}</p>}
            </div>}
          </div>
        </>}

        <div className="kyc-actions">
          {step > 0 && <Button variant="secondary" disabled={sending} onClick={() => goTo(step - 1)}>Anterior</Button>}
          {step < REVIEW_STEP
            ? <Button type="submit" disabled={Boolean(processing)}>Continuar</Button>
            : <Button type="submit" disabled={sending || Boolean(processing)}>{sending ? "Enviando…" : "Enviar expediente"}</Button>}
        </div>
        <p className="kyc-note">{draftNote} <Button variant="link" onClick={startOver} disabled={sending}>Borrar la información capturada</Button></p>
        {sending && <p className="kyc-note" role="status">Enviando su información y documentos. No cierre esta ventana.</p>}
      </form>
    </div>
  </div>;
}
