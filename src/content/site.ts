// Copy del portal. Revisar con el área responsable antes de publicar en producción.
export const siteContent = {
  name: "Grupo Antar",
  product: "Alta de clientes",
  language: "es",
  description: "Portal para que los clientes de Grupo Antar envíen su expediente KYC / CTC y su documentación.",
  navigation: [
    { href: "/", label: "Formulario" },
    { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  ],
  intro: {
    title: "Alta de clientes",
    lead: "Complete este cuestionario para integrar su expediente de cliente. Reúne en un solo formulario la información del formato KYC / CTC y del cuestionario de debida diligencia.",
    steps: "Avance por secciones, adjunte sus documentos y revise todo antes de enviarlo. Al terminar recibirá un folio de confirmación.",
    draft: "Su avance se guarda solo en esta pestaña del navegador y se borra al cerrarla. Los archivos no se guardan: adjúntelos al final.",
  },
} as const;
