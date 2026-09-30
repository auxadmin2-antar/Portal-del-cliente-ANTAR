import Link from "next/link";
export default function NotFound() { return <main id="contenido" className="container message-page" tabIndex={-1}><p className="eyebrow">404</p><h1>No encontramos esta página.</h1><p>El enlace puede haber cambiado. Puedes volver al inicio para continuar.</p><Link className="button" href="/">Volver al inicio</Link></main>; }
