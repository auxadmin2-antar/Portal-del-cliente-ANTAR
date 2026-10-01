// Copy del portal. Revisar con el área responsable antes de publicar en producción.
// Solo afirmaciones que el sistema cumple (ver docs/engineering/SECURITY_DATA.md).
export const siteContent = {
  name: "Grupo Antar",
  product: "Alta de clientes",
  language: "es",
  description: "Portal para que los clientes de Grupo Antar envíen su expediente KYC / CTC y su documentación de forma segura.",
  navigation: [
    { href: "/", label: "Inicio" },
    { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
    { href: "/acuerdo-de-confidencialidad", label: "Confidencialidad" },
  ],
  cta: { href: "/registro", label: "Iniciar registro" },
  home: {
    title: "Alta de clientes",
    lead: "Integre en línea su expediente de cliente (KYC / CTC): capture la información de su empresa, adjunte sus documentos y reciba un folio de confirmación.",
    cta: "Continuar",
    documentsTitle: "Documentos requeridos",
  },
  form: {
    title: "Formulario de alta",
    lead: "Complete cada sección. Puede volver a cualquier paso antes de enviar.",
    draft: "Su información se conserva mientras esta pestaña esté abierta, aunque consulte el aviso de privacidad u otras páginas del portal, y se borra al cerrarla o al enviar. Si recarga la página, deberá volver a adjuntar los archivos.",
  },
} as const;
