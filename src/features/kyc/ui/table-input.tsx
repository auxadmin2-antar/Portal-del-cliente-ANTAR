"use client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { LIMITS, type FieldDef, type TableRow } from "../fields.ts";

export function emptyRow(field: FieldDef): TableRow {
  return Object.fromEntries((field.columns ?? []).map(column => [column.id, ""]));
}

type Props = { field: FieldDef; rows: TableRow[]; error?: string; onChange: (rows: TableRow[]) => void };

export function TableInput({ field, rows, error, onChange }: Props) {
  const columns = field.columns ?? [];
  const id = `f-${field.id}`;
  const update = (index: number, column: string, value: string) => onChange(rows.map((row, position) => position === index ? { ...row, [column]: value } : row));
  const describedBy = [field.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

  // El título queda fuera; todo lo demás (indicación, registros, botón y errores) dentro del cuadro gris.
  return <fieldset className="field wide" aria-describedby={describedBy}>
    <legend>{field.label}{!field.required && <span className="field-optional">(opcional)</span>}</legend>
    <div className="table-box" data-invalid={error ? true : undefined}>
      {field.hint && <p id={`${id}-hint`} className="field-hint">{field.hint}</p>}
      {rows.length === 0 && <p className="rows-empty">Aún no hay registros.</p>}
      {rows.map((row, index) => <div className="row-block" role="group" aria-labelledby={`${id}-${index}-title`} key={index}>
        <div className="row-head">
          <p className="row-title" id={`${id}-${index}-title`}>Registro {index + 1}</p>
          <Button variant="link" onClick={() => onChange(rows.filter((_, position) => position !== index))}>Quitar<span className="visually-hidden"> registro {index + 1}</span></Button>
        </div>
        <div className="row-grid">
          {columns.map(column => <Field
            key={column.id}
            id={`${id}-${index}-${column.id}`}
            label={column.label}
            type={column.type === "date" ? "date" : "text"}
            inputMode={column.type === "percent" ? "decimal" : undefined}
            maxLength={LIMITS.tableCell}
            value={row[column.id] ?? ""}
            onChange={event => update(index, column.id, event.target.value)}
          />)}
        </div>
      </div>)}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
      <div className="table-actions">
        <Button id={id} variant="secondary" disabled={rows.length >= LIMITS.tableRows} onClick={() => onChange([...rows, emptyRow(field)])}>+ Agregar registro</Button>
      </div>
    </div>
  </fieldset>;
}
