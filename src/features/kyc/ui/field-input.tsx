"use client";
import { CheckboxField, ChoiceField, Field, TextareaField } from "@/components/ui/field";
import Link from "next/link";
import { LIMITS, labelParts, type FieldDef, type KycValue, type TableRow } from "../fields.ts";
import { TableInput } from "./table-input";

const YES_NO = [{ value: "si", label: "Sí" }, { value: "no", label: "No" }];
const INPUT_TYPES: Partial<Record<FieldDef["type"], string>> = { date: "date", email: "email", tel: "tel" };

/** Etiqueta con enlaces internos navegables; el formulario se conserva al volver. */
function RichLabel({ label }: { label: string }) {
  return <>{labelParts(label).map((part, index) => part.href
    ? <Link key={index} href={part.href}>{part.text}</Link>
    : <span key={index}>{part.text}</span>)}</>;
}

/** Id del elemento que recibe el foco desde el resumen de errores. */
export function focusTarget(field: FieldDef) {
  if (field.type === "yesno" || field.type === "yesnona") return `f-${field.id}-si`;
  return `f-${field.id}`;
}

type Props = { field: FieldDef; value: KycValue; error?: string; onChange: (id: string, value: KycValue) => void };

export function FieldInput({ field, value, error, onChange }: Props) {
  const id = `f-${field.id}`;
  const optional = !field.required;
  const wide = ["textarea", "table", "yesno", "yesnona", "check"].includes(field.type) || field.label.length > 70;
  const className = wide ? "wide" : "";
  const text = typeof value === "string" ? value : "";

  switch (field.type) {
    case "table":
      return <TableInput field={field} rows={Array.isArray(value) ? value as TableRow[] : []} error={error} onChange={rows => onChange(field.id, rows)} />;
    case "textarea":
      return <TextareaField id={id} label={field.label} hint={field.hint} error={error} optional={optional} className={className} value={text} maxLength={LIMITS.textarea} rows={4} onChange={event => onChange(field.id, event.target.value)} />;
    case "yesno":
    case "yesnona":
      return <ChoiceField id={id} name={field.id} label={field.label} hint={field.hint} error={error} optional={optional} className={className} value={text}
        options={field.type === "yesnona" ? [...YES_NO, { value: "na", label: field.naLabel ?? "No aplica" }] : YES_NO}
        onChange={next => onChange(field.id, next)} />;
    case "check":
      return <CheckboxField id={id} label={<RichLabel label={field.label} />} hint={field.hint} error={error} className={className} checked={text === "on"} onChange={checked => onChange(field.id, checked ? "on" : "")} />;
    default:
      return <Field id={id} label={field.label} hint={field.hint} error={error} optional={optional} className={className}
        type={INPUT_TYPES[field.type] ?? "text"}
        inputMode={field.type === "number" ? "numeric" : undefined}
        autoComplete={field.autoComplete ?? "off"}
        maxLength={LIMITS.text}
        aria-required={field.required || undefined}
        value={text}
        onChange={event => onChange(field.id, field.uppercase ? event.target.value.toUpperCase() : event.target.value)} />;
  }
}
