import "server-only";
import { readKycConfig } from "./kyc.schema";

export function getKycConfig() { return readKycConfig(process.env); }

/** Datos que el formulario puede conocer. Nunca incluye secretos ni destinatarios. */
export function getPublicKycSettings() {
  try {
    const config = getKycConfig();
    return { available: true, siteKey: config.captcha?.siteKey ?? null, maxFileBytes: config.limits.maxFileBytes, maxTotalBytes: config.limits.maxTotalBytes } as const;
  } catch {
    return { available: false, siteKey: null, maxFileBytes: 0, maxTotalBytes: 0 } as const;
  }
}
