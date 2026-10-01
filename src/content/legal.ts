// Datos del responsable y estructura común de los documentos legales del portal.
// Los valores entre corchetes están PENDIENTES: llenarlos una sola vez aquí.
// Los textos son un borrador y deben ser revisados y aprobados por el área jurídica.

export const COMPANY = {
  tradeName: "Grupo Antar",
  legalName: "[Razón social completa de la empresa]",
  address: "[Domicilio completo: calle, número, colonia, municipio, estado y código postal]",
  privacyArea: "[Área o persona responsable de datos personales]",
  privacyEmail: "[correo electrónico para temas de privacidad]",
  phone: "[teléfono de contacto]",
  jurisdiction: "[ciudad y estado para la jurisdicción]",
  confidentialityYears: "5 (cinco)",
} as const;

export type LegalBlock = { p: string } | { list: string[] };
export type LegalSection = { id: string; heading: string; blocks: LegalBlock[] };
export type LegalDocument = {
  title: string;
  /** Identificador de versión; se imprime en el expediente al aceptar. */
  version: string;
  status: "draft" | "approved";
  summary: string[];
  sections: LegalSection[];
};
