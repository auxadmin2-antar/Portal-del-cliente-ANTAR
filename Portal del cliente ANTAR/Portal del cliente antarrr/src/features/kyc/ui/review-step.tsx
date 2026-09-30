"use client";
import { Button } from "@/components/ui/button";
import { DOCUMENTS, SECTIONS, isVisible, type FieldDef, type KycValues, type TableRow } from "../fields.ts";
import { formatBytes } from "./image";

function display(field: FieldDef, value: string) {
  if (field.type === "yesno" || field.type === "yesnona") return value === "si" ? "Sí" : value === "no" ? "No" : value === "na" ? field.naLabel ?? "No aplica" : "";
  if (field.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value.split("-").reverse().join("/");
  return field.uppercase ? value.toUpperCase() : value;
}

type Props = { values: KycValues; files: Record<string, File | undefined>; onEdit: (step: number) => void; documentsStep: number };

export function ReviewStep({ values, files, onEdit, documentsStep }: Props) {
  return <div>
    {SECTIONS.map((section, index) => {
      const entries = section.fields.filter(field => isVisible(field, values) && field.type !== "check").flatMap(field => {
        const value = values[field.id];
        if (field.type === "table") {
          const rows = (value as TableRow[]).filter(row => Object.values(row).some(Boolean));
          if (!rows.length) return [];
          const columns = field.columns ?? [];
          return [{ field, text: rows.map(row => columns.map(column => display({ ...field, type: column.type === "date" ? "date" : "text" }, row[column.id] ?? "")).join(" · ")).join("\n") }];
        }
        const text = display(field, value as string);
        return text ? [{ field, text }] : [];
      });
      return <section className="review-section" key={section.id} aria-labelledby={`review-${section.id}`}>
        <header>
          <h3 id={`review-${section.id}`}>{index + 1}. {section.title}</h3>
          <Button variant="link" onClick={() => onEdit(index)}>Editar<span className="visually-hidden"> {section.title}</span></Button>
        </header>
        {entries.length ? <dl className="review-list">
          {entries.map(({ field, text }) => <div key={field.id}><dt>{field.label}</dt><dd>{text}</dd></div>)}
        </dl> : <p className="rows-empty">Sin datos capturados.</p>}
      </section>;
    })}
    <section className="review-section" aria-labelledby="review-docs">
      <header>
        <h3 id="review-docs">{SECTIONS.length + 1}. Documentos</h3>
        <Button variant="link" onClick={() => onEdit(documentsStep)}>Editar<span className="visually-hidden"> documentos</span></Button>
      </header>
      <dl className="review-list">
        {DOCUMENTS.map(document => {
          const file = files[document.id];
          return <div key={document.id}><dt>{document.label}</dt><dd>{file ? `${file.name} · ${formatBytes(file.size)}` : "No adjuntado"}</dd></div>;
        })}
      </dl>
    </section>
  </div>;
}
