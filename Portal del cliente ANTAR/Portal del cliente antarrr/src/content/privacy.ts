// BORRADOR. El texto definitivo del aviso de privacidad debe redactarlo o aprobarlo
// el área legal de la empresa (LFPDPPP). Los campos entre corchetes están pendientes.
export const privacyNotice = {
  status: "draft" as "draft" | "approved",
  title: "Aviso de privacidad",
  sections: [
    { heading: "Responsable", body: "[Razón social del responsable], con domicilio en [domicilio], es responsable del tratamiento de los datos personales que usted proporciona en este portal." },
    { heading: "Datos que recabamos", body: "Datos de identificación y contacto de los representantes, directivos, accionistas y beneficiarios finales de la empresa solicitante; datos patrimoniales y financieros (cuenta bancaria); y los documentos que usted adjunta." },
    { heading: "Finalidades", body: "Integrar el expediente de conocimiento del cliente (KYC / CTC), evaluar la solicitud de alta como cliente y cumplir las obligaciones legales y regulatorias aplicables." },
    { heading: "Transferencias", body: "[Indicar si existen transferencias y a quién, o que solo se realizarán las requeridas por autoridad competente de forma fundada y motivada.]" },
    { heading: "Derechos ARCO", body: "Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición, o revocar su consentimiento, mediante solicitud a [correo electrónico de contacto]." },
    { heading: "Cambios al aviso", body: "Cualquier modificación a este aviso se publicará en esta misma página." },
  ],
};
