"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="contenido" className="container message-page" tabIndex={-1}><h1>No pudimos cargar la página.</h1><p>Inténtalo de nuevo en unos momentos.</p><Button onClick={reset}>Reintentar</Button></main>;
}
