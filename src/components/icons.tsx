// Íconos de línea simples, decorativos (aria-hidden). Sin dependencias externas.
type Props = { className?: string };
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

export const IconFile = ({ className }: Props) => <svg {...base} className={className}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>;
export const IconArrow = ({ className }: Props) => <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
