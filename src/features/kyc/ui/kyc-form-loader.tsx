"use client";
import dynamic from "next/dynamic";
import type { KycFormSettings } from "./kyc-form";

// El formulario se monta solo en el navegador para restaurar lo capturado en esta pestaña
// (memoria y sessionStorage) desde el primer render.
const KycForm = dynamic(() => import("./kyc-form").then(module => module.KycForm), {
  ssr: false,
  loading: () => <div className="kyc-panel" aria-busy="true"><p>Cargando formulario…</p></div>,
});

export function KycFormLoader(props: { settings: KycFormSettings; nonce?: string; draftNote: string }) {
  return <KycForm {...props} />;
}
