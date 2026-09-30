import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type Common = { id: string; label: ReactNode; hint?: string; error?: string; optional?: boolean; className?: string };

function describedBy(id: string, hint?: string, error?: string, extra?: string) {
  return [extra, hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

function Label({ id, label, optional }: Pick<Common, "id" | "label" | "optional">) {
  return <label htmlFor={id}>{label}{optional && <span className="field-optional">(opcional)</span>}</label>;
}

function Messages({ id, hint, error }: Pick<Common, "id" | "hint" | "error">) {
  return <>
    {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
    {error && <p id={`${id}-error`} className="field-error">{error}</p>}
  </>;
}

type InputProps = Common & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;
export function Field({ id, label, hint, error, optional, className = "", ...props }: InputProps) {
  return <div className={`field ${className}`}>
    <Label id={id} label={label} optional={optional} />
    <input {...props} id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error, props["aria-describedby"])} />
    <Messages id={id} hint={hint} error={error} />
  </div>;
}

type TextareaProps = Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;
export function TextareaField({ id, label, hint, error, optional, className = "", ...props }: TextareaProps) {
  return <div className={`field ${className}`}>
    <Label id={id} label={label} optional={optional} />
    <textarea {...props} id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error)} />
    <Messages id={id} hint={hint} error={error} />
  </div>;
}

type ChoiceProps = Common & { name: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; required?: boolean };
export function ChoiceField({ id, label, hint, error, optional, className = "", name, value, options, onChange, required }: ChoiceProps) {
  return <fieldset className={`field ${className}`} aria-describedby={describedBy(id, hint, error)} aria-invalid={error ? true : undefined}>
    <legend>{label}{optional && <span className="field-optional">(opcional)</span>}</legend>
    <div className="choice-options">
      {options.map(option => <label key={option.value} className="choice">
        <input type="radio" id={`${id}-${option.value}`} name={name} value={option.value} checked={value === option.value} required={required} onChange={() => onChange(option.value)} />
        {option.label}
      </label>)}
    </div>
    <Messages id={id} hint={hint} error={error} />
  </fieldset>;
}

type CheckboxProps = Common & { checked: boolean; onChange: (checked: boolean) => void };
export function CheckboxField({ id, label, hint, error, className = "", checked, onChange }: CheckboxProps) {
  return <div className={`field ${className}`}>
    <label className="checkbox" htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={event => onChange(event.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, hint, error)} />
      <span>{label}</span>
    </label>
    <Messages id={id} hint={hint} error={error} />
  </div>;
}
