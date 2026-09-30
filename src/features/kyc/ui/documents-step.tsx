"use client";
import { Button } from "@/components/ui/button";
import { DOCUMENTS } from "../fields.ts";
import { formatBytes } from "./image";

type Props = {
  files: Record<string, File | undefined>;
  errors: Record<string, string>;
  processing: string | null;
  maxFileBytes: number;
  maxTotalBytes: number;
  onSelect: (id: string, file: File) => void;
  onRemove: (id: string) => void;
};

export function DocumentsStep({ files, errors, processing, maxFileBytes, maxTotalBytes, onSelect, onRemove }: Props) {
  const used = Object.values(files).reduce((sum, file) => sum + (file?.size ?? 0), 0);
  return <>
    <div className="usage">
      <span id="usage-label">Espacio usado: {formatBytes(used)} de {formatBytes(maxTotalBytes)} · Máximo {formatBytes(maxFileBytes)} por archivo · PDF, JPG o PNG</span>
      <progress aria-labelledby="usage-label" max={maxTotalBytes} value={Math.min(used, maxTotalBytes)} />
    </div>
    <div className="documents">
      {DOCUMENTS.map(document => {
        const id = `f-${document.id}`;
        const file = files[document.id];
        const error = errors[document.id];
        const busy = processing === document.id;
        return <div className="document" key={document.id} data-invalid={error ? true : undefined}>
          <div>
            <h3>{document.label}{!document.required && <span className="field-optional">(opcional)</span>}</h3>
            {document.hint && <p>{document.hint}</p>}
            <p aria-live="polite">{busy ? "Preparando archivo…" : file ? <span className="file-name">{file.name} · {formatBytes(file.size)}</span> : "Sin archivo."}</p>
          </div>
          <div className="document-controls">
            <input
              type="file"
              id={id}
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              disabled={busy}
              aria-describedby={error ? `${id}-error` : undefined}
              aria-invalid={error ? true : undefined}
              onChange={event => {
                const selected = event.target.files?.[0];
                event.target.value = "";
                if (selected) onSelect(document.id, selected);
              }}
            />
            <label htmlFor={id} className="button button--secondary">{file ? "Cambiar archivo" : "Seleccionar archivo"}<span className="visually-hidden">: {document.label}</span></label>
            {file && <Button variant="link" onClick={() => onRemove(document.id)}>Quitar<span className="visually-hidden"> {document.label}</span></Button>}
          </div>
          {error && <p id={`${id}-error`} className="field-error">{error}</p>}
        </div>;
      })}
    </div>
  </>;
}
