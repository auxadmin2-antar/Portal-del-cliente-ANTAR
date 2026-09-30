// Expediente KYC/CTC unificado: combina "Formato KYC-CTC" y "Modelo KYC".
// Fuente única para el formulario, la validación del servidor y el PDF.

export type FieldType = "text" | "textarea" | "date" | "email" | "tel" | "number" | "yesno" | "yesnona" | "check" | "table";
export type ColumnType = "text" | "date" | "percent";
export type Column = { id: string; label: string; type?: ColumnType };
export type Condition = { field: string; equals: string };

export type FieldDef = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  pattern?: string;
  message?: string;
  uppercase?: boolean;
  min?: number;
  max?: number;
  showIf?: Condition;
  columns?: Column[];
  naLabel?: string;
  /** Respuesta que el área de cumplimiento debe revisar. */
  flagOn?: "si" | "no";
  autoComplete?: string;
};

export type Section = { id: string; title: string; description?: string; fields: FieldDef[] };
export type DocumentDef = { id: string; label: string; hint?: string; required: boolean };

export type TableRow = Record<string, string>;
export type KycValue = string | TableRow[];
export type KycValues = Record<string, KycValue>;

export const LIMITS = { text: 200, textarea: 2000, tableRows: 20, tableCell: 200 } as const;
export const FILE_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"] as const;

const RFC = "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$";
const PHONE = "^[0-9+()\\s.,/-]{7,60}$";
const yes = (field: string): Condition => ({ field, equals: "si" });
const no = (field: string): Condition => ({ field, equals: "no" });

export const SECTIONS: Section[] = [
  {
    id: "empresa", title: "Información general de la empresa", fields: [
      { id: "razon_social", label: "Nombre completo de la empresa (razón social)", type: "text", required: true, autoComplete: "organization" },
      { id: "nombre_comercial", label: "Nombres comerciales", type: "text" },
      { id: "rfc", label: "RFC", type: "text", required: true, uppercase: true, pattern: RFC, message: "Escriba un RFC válido de 12 o 13 caracteres.", hint: "Registro Federal de Contribuyentes, sin guiones ni espacios." },
      { id: "num_registro", label: "Número de registro (folio mercantil)", type: "text" },
      { id: "fecha_constitucion", label: "Fecha de constitución", type: "date", required: true },
      { id: "sitio_web", label: "Sitio web", type: "text", pattern: "^(https?://)?[\\w.-]+\\.[a-z]{2,}(/\\S*)?$", message: "Escriba una dirección web válida.", autoComplete: "url" },
      { id: "lugar", label: "Lugar desde donde se presenta la solicitud", type: "text", required: true, hint: "Ciudad y estado." },
      { id: "dom_calle", label: "Domicilio legal: calle y número", type: "text", required: true, autoComplete: "address-line1" },
      { id: "dom_colonia", label: "Colonia", type: "text", required: true, autoComplete: "address-line2" },
      { id: "dom_municipio", label: "Alcaldía o municipio", type: "text", required: true, autoComplete: "address-level2" },
      { id: "dom_estado", label: "Estado", type: "text", required: true, autoComplete: "address-level1" },
      { id: "dom_cp", label: "Código postal", type: "text", required: true, pattern: "^[0-9]{5}$", message: "El código postal tiene 5 dígitos.", autoComplete: "postal-code" },
      { id: "telefonos", label: "Teléfonos de la empresa", type: "text", required: true, pattern: PHONE, message: "Escriba un teléfono válido.", autoComplete: "tel" },
      { id: "dir_facturacion", label: "Dirección de facturación, si es diferente a la legal", type: "textarea" },
      { id: "dir_comercial", label: "Dirección comercial, si es diferente a la legal", type: "textarea" },
      { id: "actividades", label: "Actividades principales de la empresa", type: "textarea", required: true, hint: "Por ejemplo: comerciante, proveedor, refinería, consumidor." },
      { id: "paises", label: "Países en los que opera", type: "text", required: true },
      { id: "empleados", label: "Cantidad de empleados", type: "number", required: true, min: 0, max: 1_000_000 },
    ],
  },
  {
    id: "banco", title: "Banco principal", fields: [
      { id: "banco_nombre", label: "Nombre del banco", type: "text", required: true },
      { id: "banco_direccion", label: "Dirección o sitio web del banco", type: "text" },
      { id: "banco_cuenta", label: "Número de cuenta o CLABE", type: "text", required: true, pattern: "^[0-9A-Za-z -]{6,34}$", message: "Escriba un número de cuenta válido." },
      { id: "banco_titular", label: "Nombre del titular de la cuenta", type: "text", required: true },
      { id: "banco_swift", label: "Código Swift o IBAN", type: "text", uppercase: true, pattern: "^[A-Za-z0-9 ]{6,34}$", message: "Escriba un código Swift o IBAN válido." },
    ],
  },
  {
    id: "constitucion", title: "Instrumento constitutivo y administración", fields: [
      { id: "inst_numero", label: "Número de instrumento (acta constitutiva)", type: "text", required: true },
      { id: "inst_fedatario", label: "Número y adscripción del fedatario", type: "text", required: true, hint: "Notario o corredor público y su plaza." },
      { id: "inst_registro", label: "Datos de inscripción en el Registro Público", type: "text", required: true },
      { id: "inst_fecha", label: "Fecha del instrumento", type: "date", required: true },
      { id: "hay_modif", label: "¿El instrumento constitutivo tiene modificaciones?", type: "yesno", required: true },
      { id: "mod_desc", label: "Modificación realizada", type: "textarea", required: true, showIf: yes("hay_modif") },
      { id: "mod_numero", label: "Número de instrumento de la modificación", type: "text", required: true, showIf: yes("hay_modif") },
      { id: "mod_fedatario", label: "Número y adscripción del fedatario de la modificación", type: "text", required: true, showIf: yes("hay_modif") },
      { id: "mod_registro", label: "Datos de inscripción de la modificación en el Registro Público", type: "text", required: true, showIf: yes("hay_modif") },
      { id: "mod_fecha", label: "Fecha del instrumento de la modificación", type: "date", required: true, showIf: yes("hay_modif") },
      {
        id: "administradores", label: "Administrador o gerentes de la sociedad", type: "table", required: true,
        columns: [{ id: "posicion", label: "Posición en la estructura" }, { id: "nombre", label: "Nombre completo" }],
      },
    ],
  },
  {
    id: "representante", title: "Representante legal o apoderado", description: "Persona que firma y responde por la información de este expediente.", fields: [
      { id: "rep_nombre", label: "Nombre completo", type: "text", required: true, autoComplete: "name" },
      { id: "rep_cargo", label: "Cargo", type: "text", required: true, autoComplete: "organization-title" },
      { id: "rep_nacionalidad", label: "Nacionalidad", type: "text", required: true },
      { id: "poder_numero", label: "Poder notarial: número de instrumento", type: "text", required: true },
      { id: "poder_fedatario", label: "Número y adscripción del fedatario del poder", type: "text", required: true },
      { id: "poder_fecha", label: "Fecha del poder notarial", type: "date", required: true },
    ],
  },
  {
    id: "operaciones", title: "Operaciones con nosotros", fields: [
      { id: "negocio", label: "¿Qué negocio tiene previsto hacer con nosotros?", type: "textarea", required: true },
      { id: "contacto_nombre", label: "Nombre de la persona de contacto", type: "text", required: true },
      { id: "contacto_email", label: "Correo electrónico de contacto", type: "email", required: true, autoComplete: "email" },
      { id: "contacto_tel", label: "Teléfono directo de contacto", type: "tel", required: true, autoComplete: "tel" },
      { id: "licencia", label: "¿Este negocio requiere alguna licencia regulatoria u operativa?", type: "yesno", required: true },
      { id: "licencia_det", label: "Describa las licencias requeridas", type: "textarea", required: true, showIf: yes("licencia") },
      { id: "fuente_fondos", label: "Fuente de los fondos para el negocio", type: "textarea", required: true },
      { id: "recursos_licitos", label: "Bajo protesta de decir verdad, ¿los recursos que la empresa pretende invertir son de procedencia lícita?", type: "yesno", required: true, flagOn: "no" },
    ],
  },
  {
    id: "titularidad", title: "Titularidad y estructura corporativa", fields: [
      { id: "cotiza", label: "¿La empresa cotiza en Bolsa o pertenece a un grupo que cotiza?", type: "yesno", required: true },
      { id: "cotiza_det", label: "Nombre de la Bolsa de Valores", type: "text", required: true, showIf: yes("cotiza") },
      { id: "regulada", label: "¿La empresa está regulada o pertenece a un grupo regulado?", type: "yesno", required: true },
      { id: "regulada_det", label: "Nombre del regulador", type: "text", required: true, showIf: yes("regulada") },
      { id: "otros_benef", label: "¿Existen otros beneficiarios (incluidas acciones al portador o fideicomisos) que no figuren en el registro de acciones?", type: "yesno", required: true, flagOn: "si" },
      { id: "otros_benef_det", label: "Describa a esos beneficiarios", type: "textarea", required: true, showIf: yes("otros_benef") },
      { id: "estructura", label: "Estructura corporativa y accionistas", type: "textarea", required: true, hint: "Describa con claridad la estructura de la sociedad. Si forma parte de un grupo, explique la estructura del grupo." },
      {
        id: "directivos", label: "Directivos y consejo de administración", type: "table", required: true,
        columns: [{ id: "nombre", label: "Nombre completo" }, { id: "cargo", label: "Cargo" }, { id: "nacionalidad", label: "Nacionalidad" }, { id: "nacimiento", label: "Fecha de nacimiento", type: "date" }],
      },
      {
        id: "beneficiarios", label: "Beneficiarios finales", type: "table", required: true, hint: "Personas físicas que en última instancia son propietarias o controlan la empresa.",
        columns: [{ id: "nombre", label: "Nombre" }, { id: "apellido", label: "Apellidos" }, { id: "nacionalidad", label: "Nacionalidad" }, { id: "pct", label: "Tenencia accionaria (%)", type: "percent" }],
      },
    ],
  },
  {
    id: "regulatorio", title: "Información reglamentaria", description: "Complete solo si aplica a su empresa.", fields: [
      { id: "acer", label: "Código ACER", type: "text" },
      { id: "lei", label: "Identificador de entidad legal (LEI)", type: "text", uppercase: true, pattern: "^[A-Za-z0-9]{20}$", message: "El LEI tiene 20 caracteres alfanuméricos." },
    ],
  },
  {
    id: "politicas", title: "Políticas y procedimientos", description: "Indique si la empresa implementa los siguientes procedimientos o controles.", fields: [
      { id: "p_conducta", label: "Código de conducta o equivalente", type: "yesno", required: true, flagOn: "no" },
      { id: "p_soborno", label: "Políticas contra el soborno y la corrupción (conflictos de interés, regalos y entretenimiento)", type: "yesno", required: true, flagOn: "no" },
      { id: "p_aml", label: "Políticas contra el lavado de dinero (AML)", type: "yesno", required: true, flagOn: "no" },
      { id: "p_comp_si", label: "Si respondió que sí, explique cuáles son esas políticas", type: "textarea" },
      { id: "p_comp_no", label: "Si respondió que no, ¿cómo se asegura de no participar en negocios sancionados, lavado de dinero, soborno o corrupción?", type: "textarea" },
      { id: "e_salud", label: "Salud y seguridad", type: "yesno", required: true },
      { id: "e_ambiente", label: "Prevención y mitigación de impactos ambientales", type: "yesno", required: true },
      { id: "e_ddhh", label: "Derechos humanos y de los trabajadores", type: "yesno", required: true },
      { id: "e_infantil", label: "Prohibición y prevención del trabajo infantil", type: "yesno", required: true },
      { id: "e_esclavitud", label: "Prohibición y prevención de toda forma de esclavitud (trabajo forzoso, servidumbre, trata de personas)", type: "yesno", required: true },
      { id: "e_sindical", label: "Respeto al derecho de sindicación, libertad de asociación y negociación colectiva", type: "yesno", required: true },
      { id: "e_discrim", label: "Prevención de la discriminación", type: "yesno", required: true },
      { id: "e_seguridad", label: "Disposiciones de seguridad que respeten los derechos humanos (Principios Voluntarios sobre Seguridad y Derechos Humanos)", type: "yesnona", required: true, naLabel: "No hay agentes de seguridad presentes" },
      { id: "e_indigenas", label: "Derechos de los pueblos indígenas", type: "yesnona", required: true, naLabel: "No aplica" },
      { id: "e_reclamos", label: "Mecanismo de reclamación para empleados", type: "yesno", required: true },
      { id: "e_esg_si", label: "Si respondió que sí, explique cuáles son esas políticas", type: "textarea" },
      { id: "e_esg_no", label: "Si respondió que no, ¿cómo previene y mitiga los efectos adversos sobre los derechos humanos y el medio ambiente?", type: "textarea" },
      { id: "procedimientos", label: "Describa los procedimientos que garantizan que sus funcionarios cumplan los requisitos internos", type: "textarea", required: true, hint: "Por ejemplo: supervisión y capacitación." },
      { id: "dd_contrapartes", label: "¿Realiza debida diligencia de sus contrapartes (proveedores, clientes) sobre lavado de dinero, sanciones, corrupción, salud y seguridad, medio ambiente y derechos humanos y laborales?", type: "yesno", required: true, flagOn: "no" },
      { id: "dd_desc", label: "Describa su proceso de debida diligencia", type: "textarea", required: true, hint: "Si respondió que no, explique cómo garantiza el cumplimiento de esas áreas." },
      { id: "dd_fuente", label: "¿Su debida diligencia solicita información sobre la fuente de fondos de sus clientes, cuando procede?", type: "yesno", required: true },
      { id: "estatal", label: "¿Tiene relaciones comerciales con contrapartes propiedad del Estado o con accionistas que sean funcionarios públicos?", type: "yesno", required: true, flagOn: "si" },
      { id: "estatal_det", label: "Describa los controles adicionales para esas relaciones", type: "textarea", required: true, showIf: yes("estatal") },
      { id: "certificaciones", label: "Sistemas de certificación ambiental y social que sigue la empresa", type: "textarea" },
    ],
  },
  {
    id: "declaraciones", title: "Antecedentes y declaraciones", description: "Responda bajo protesta de decir verdad.", fields: [
      { id: "inhabilitada", label: "¿La empresa ha sido inhabilitada por la Administración Pública Federal?", type: "yesno", required: true, flagOn: "si" },
      { id: "inhab_det", label: "Indique la fecha y el motivo de la inhabilitación", type: "textarea", required: true, showIf: yes("inhabilitada") },
      { id: "d_corrupcion", label: "¿Confirma que la empresa no ha incurrido ni ha sido investigada por actos de corrupción de sus empleados, filiales, comisionistas, agentes, gestores, asesores, consultores, factores, dependientes, subcontratistas, proveedores o cualquier otro que intervenga directa o indirectamente en esta solicitud, y que no está vinculada con empresas investigadas o señaladas en notas periodísticas por actos de corrupción?", type: "yesno", required: true, flagOn: "no" },
      { id: "d_corrupcion_det", label: "Explique la situación", type: "textarea", required: true, showIf: no("d_corrupcion") },
      { id: "d_litigios", label: "¿Confirma que la empresa, sus subsidiarias o filiales no han iniciado ningún procedimiento legal contra una entidad, dependencia o autoridad de la Administración Pública Federal?", type: "yesno", required: true, flagOn: "no" },
      { id: "d_litigios_det", label: "Describa el procedimiento iniciado", type: "textarea", required: true, showIf: no("d_litigios") },
      { id: "d_funcionario", label: "¿Algún accionista, consejero, signatario autorizado o directivo está relacionado con un funcionario público o sus familiares?", type: "yesno", required: true, flagOn: "si" },
      { id: "d_funcionario_det", label: "Proporcione detalles de la relación", type: "textarea", required: true, showIf: yes("d_funcionario") },
      { id: "d_investigado", label: "¿La empresa o algún accionista, consejero, signatario o alto directivo ha sido investigado, acusado o condenado por un delito o infracción regulatoria, incluido soborno o corrupción, o tiene investigaciones pendientes?", type: "yesno", required: true, flagOn: "si" },
      { id: "d_investigado_det", label: "Proporcione detalles", type: "textarea", required: true, showIf: yes("d_investigado") },
      { id: "d_ambiental", label: "¿La empresa, un signatario o un alto directivo ha sido investigado, acusado, condenado o multado por temas ambientales, de salud y seguridad, trabajo infantil o forzoso, derechos de pueblos indígenas u otras violaciones graves de derechos humanos o laborales?", type: "yesno", required: true, flagOn: "si" },
      { id: "d_ambiental_det", label: "Proporcione detalles", type: "textarea", required: true, showIf: yes("d_ambiental") },
      { id: "d_calidad", label: "¿Confirma que la empresa conoce el marco de gestión de calidad?", type: "yesno", required: true, flagOn: "no" },
      { id: "d_cuenta", label: "¿Confirma que la operación de la cuenta bancaria proporcionada no infringe las leyes aplicables (evasión fiscal, controles de cambio, sanciones económicas) y que la empresa tiene derecho legal a realizar y recibir pagos en ella?", type: "yesno", required: true, flagOn: "no" },
    ],
  },
];

export const DOCUMENTS: DocumentDef[] = [
  { id: "doc_csf", label: "Constancia de situación fiscal", hint: "Del mes en curso.", required: true },
  { id: "doc_acta", label: "Acta constitutiva y, en su caso, modificaciones", required: true },
  { id: "doc_poder", label: "Instrumento notarial que acredite las facultades del signatario", required: true },
  { id: "doc_ident", label: "Identificación oficial del representante legal", required: true },
  { id: "doc_sat", label: "Opinión positiva de cumplimiento SAT", hint: "Del mes en curso.", required: true },
  { id: "doc_imss", label: "Opinión positiva de cumplimiento IMSS", hint: "Del mes en curso.", required: true },
  { id: "doc_infonavit", label: "Opinión positiva de cumplimiento INFONAVIT", hint: "Del mes en curso.", required: true },
  { id: "doc_domicilio", label: "Comprobante de domicilio", hint: "Con antigüedad no mayor a tres meses.", required: true },
  { id: "doc_estructura", label: "Organigrama o estructura corporativa", hint: "Opcional si ya la describió en el formulario.", required: false },
];

export const SIGNATURE: FieldDef[] = [
  { id: "firm_nombre", label: "Nombre completo de quien envía", type: "text", required: true, autoComplete: "name" },
  { id: "firm_cargo", label: "Cargo", type: "text", required: true, autoComplete: "organization-title" },
  { id: "ack_veraz", label: "Declaro bajo protesta de decir verdad que la información y los documentos proporcionados son veraces y exactos a la fecha de envío.", type: "check", required: true },
  { id: "ack_privacidad", label: "He leído y acepto el aviso de privacidad.", type: "check", required: true },
];

export const ALL_FIELDS: FieldDef[] = [...SECTIONS.flatMap(section => section.fields), ...SIGNATURE];

export function isVisible(field: FieldDef, values: KycValues) {
  return !field.showIf || values[field.showIf.field] === field.showIf.equals;
}

/** Respuestas marcadas para revisión de cumplimiento. */
export function flaggedFields(values: KycValues) {
  return ALL_FIELDS.filter(field => field.flagOn && isVisible(field, values) && values[field.id] === field.flagOn);
}

export function emptyValues(): KycValues {
  return Object.fromEntries(ALL_FIELDS.map(field => [field.id, field.type === "table" ? [] : ""]));
}
