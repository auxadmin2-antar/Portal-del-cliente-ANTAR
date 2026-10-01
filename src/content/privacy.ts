// BORRADOR para revisión jurídica. Basado en la Ley Federal de Protección de Datos
// Personales en Posesión de los Particulares vigente. Describe el funcionamiento real
// del portal (sin almacenamiento propio, entrega por correo a buzones institucionales).
import { COMPANY, type LegalDocument } from "./legal.ts";

const c = COMPANY;

export const privacyNotice: LegalDocument = {
  title: "Aviso de privacidad integral",
  version: "2026-09-30",
  status: "draft",
  summary: [
    `${c.tradeName} utiliza la información que usted proporciona en este portal únicamente para integrar su expediente de cliente (conocimiento del cliente, KYC / CTC), evaluar su solicitud y cumplir obligaciones legales.`,
    "Solo el personal autorizado de la empresa puede consultarla. No la vendemos, no la usamos con fines publicitarios y no la compartimos con terceros, salvo por mandato legal de una autoridad competente.",
    "Usted puede acceder a sus datos, corregirlos, cancelarlos, oponerse a su uso o revocar su consentimiento en cualquier momento.",
  ],
  sections: [
    {
      id: "responsable", heading: "1. Identidad y domicilio del responsable", blocks: [
        { p: `${c.legalName} (en adelante, "${c.tradeName}" o "la Empresa"), con domicilio en ${c.address}, es la responsable del uso y protección de los datos personales que usted proporciona a través del portal de alta de clientes (en adelante, "el Portal"), y le informa lo siguiente en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás normativa aplicable (en adelante, "la Ley").` },
        { p: `Para cualquier asunto relacionado con este aviso o con sus datos personales, puede comunicarse con ${c.privacyArea}, al correo ${c.privacyEmail} o al teléfono ${c.phone}.` },
      ],
    },
    {
      id: "alcance", heading: "2. Alcance de este aviso", blocks: [
        { p: "Este aviso aplica a todos los datos personales que se capturan, adjuntan o generan al utilizar el Portal, ya sean de la persona que llena el formulario o de las personas físicas relacionadas con la empresa solicitante, como su representante legal, administradores, directivos, consejeros, accionistas, beneficiarios finales y personas de contacto." },
        { p: "Los datos de la persona moral solicitante (razón social, RFC, domicilio fiscal, datos del acta constitutiva y similares) no son datos personales en términos de la Ley; sin embargo, la Empresa les otorga el mismo nivel de protección y confidencialidad que se describe en este aviso y en el Acuerdo de confidencialidad publicado en el Portal." },
      ],
    },
    {
      id: "datos", heading: "3. Datos personales que recabamos", blocks: [
        { p: "Para cumplir las finalidades descritas en este aviso, la Empresa podrá recabar las siguientes categorías de datos personales:" },
        { list: [
          "Datos de identificación: nombre completo, nacionalidad, fecha de nacimiento, cargo o puesto, firma y los datos contenidos en la identificación oficial que usted adjunte.",
          "Datos de contacto: correo electrónico, números telefónicos y domicilio.",
          "Datos laborales y corporativos: cargo en la estructura de la empresa, facultades de representación, datos de poderes notariales y participación en órganos de administración.",
          "Datos patrimoniales y financieros: nombre del banco, número de cuenta o CLABE, titular de la cuenta, código Swift o IBAN, porcentaje de tenencia accionaria y fuente de los recursos.",
          "Datos sobre antecedentes y cumplimiento: respuestas a las declaraciones sobre inhabilitaciones, procedimientos legales, investigaciones, relación con funcionarios públicos y cumplimiento normativo.",
          "Datos contenidos en documentos: los que aparezcan en la constancia de situación fiscal, opiniones de cumplimiento, actas, poderes, comprobantes de domicilio e identificaciones que usted adjunte.",
          "Datos técnicos de seguridad: dirección IP, fecha y hora de envío y la información mínima que utiliza el sistema de verificación contra accesos automatizados, únicamente para proteger el Portal frente a abusos.",
        ] },
        { p: "Los datos patrimoniales y financieros requieren su consentimiento expreso, que usted otorga al marcar la casilla correspondiente antes de enviar el formulario." },
      ],
    },
    {
      id: "sensibles", heading: "4. Datos personales sensibles", blocks: [
        { p: "La Empresa no solicita datos personales sensibles, como los relativos a origen racial o étnico, estado de salud, información genética, creencias religiosas, filosóficas o morales, afiliación sindical, opiniones políticas o preferencia sexual." },
        { p: "Le pedimos no incluir este tipo de información en los campos de texto ni en los documentos que adjunte. Si algún documento la contiene de forma incidental, la Empresa no la utilizará para ninguna finalidad y la tratará con las medidas de seguridad más estrictas previstas en este aviso." },
      ],
    },
    {
      id: "terceros", heading: "5. Datos de terceros que usted proporciona", blocks: [
        { p: "Al proporcionar datos de otras personas físicas (por ejemplo, accionistas, directivos, beneficiarios finales o personas de contacto), usted declara que cuenta con la facultad para hacerlo, que les ha informado sobre el contenido de este aviso de privacidad y que, cuando resulte necesario, ha obtenido su consentimiento." },
        { p: "Esas personas pueden ejercer directamente ante la Empresa los derechos descritos en la sección 13 de este aviso." },
      ],
    },
    {
      id: "finalidades", heading: "6. Finalidades del tratamiento", blocks: [
        { p: "Los datos personales se utilizarán exclusivamente para las siguientes finalidades, que son necesarias para atender su solicitud y para la relación jurídica con la Empresa (finalidades primarias):" },
        { list: [
          "Identificar a la empresa solicitante, a su representante legal y a las personas relacionadas con ella.",
          "Verificar la identidad, las facultades de representación y la existencia legal de la empresa solicitante.",
          "Integrar, revisar y resguardar el expediente de conocimiento del cliente (KYC / CTC).",
          "Realizar la debida diligencia en materia de prevención de operaciones con recursos de procedencia ilícita, anticorrupción, sanciones y cumplimiento normativo.",
          "Evaluar y, en su caso, aprobar el alta como cliente y dar seguimiento a la solicitud.",
          "Comunicarnos con usted en relación con su solicitud, aclaraciones o información faltante.",
          "Dar de alta y administrar la relación comercial, incluida la facturación, los pagos y la cobranza, en caso de que la solicitud sea aprobada.",
          "Cumplir obligaciones previstas en las disposiciones fiscales, mercantiles, de prevención de lavado de dinero y demás normativa aplicable, así como atender requerimientos de autoridades competentes.",
          "Proteger la seguridad del Portal y prevenir fraudes, accesos no autorizados y envíos automatizados.",
          "Ejercer o defender los derechos de la Empresa en procedimientos judiciales o administrativos.",
        ] },
      ],
    },
    {
      id: "no-secundarias", heading: "7. Usos que la Empresa NO realizará", blocks: [
        { p: "La Empresa no utiliza sus datos personales para finalidades secundarias. En particular, la Empresa se obliga a NO:" },
        { list: [
          "Vender, rentar, ceder o comercializar sus datos personales o la información de su empresa.",
          "Utilizarlos con fines de mercadotecnia, publicidad, prospección comercial o envío de promociones.",
          "Elaborar perfiles con fines comerciales ajenos a la evaluación de su solicitud.",
          "Compartirlos con empresas, socios comerciales o terceros para que los usen en su propio beneficio.",
          "Publicarlos, divulgarlos o darlos a conocer a personas no autorizadas.",
          "Utilizarlos para entrenar sistemas de inteligencia artificial o incorporarlos a bases de datos con fines distintos a los de este aviso.",
          "Utilizar la información en perjuicio de usted, de su empresa o de las personas relacionadas.",
        ] },
        { p: "Si en el futuro la Empresa necesitara utilizar sus datos para una finalidad distinta, le solicitará previamente su consentimiento." },
      ],
    },
    {
      id: "consentimiento", heading: "8. Consentimiento", blocks: [
        { p: "Al marcar la casilla de aceptación de este aviso y enviar el formulario, usted otorga su consentimiento expreso para el tratamiento de sus datos personales, incluidos los patrimoniales y financieros, para las finalidades descritas en la sección 6." },
        { p: "El Portal registra la fecha y hora de la aceptación y la versión de este aviso en el expediente generado con su folio, como constancia del consentimiento otorgado por medios electrónicos." },
      ],
    },
    {
      id: "portal", heading: "9. Cómo funciona el Portal con sus datos", blocks: [
        { p: "Para su tranquilidad, le explicamos qué ocurre con su información desde que la captura hasta que la recibe la Empresa:" },
        { list: [
          "Mientras llena el formulario, lo capturado se conserva únicamente en la pestaña de su navegador: el texto en el almacenamiento temporal de la pestaña y los archivos solo en memoria, sin escribirse en el disco de su equipo. Todo se elimina al cerrar la pestaña, al enviar el formulario o al elegir «Borrar la información capturada». La Empresa no tiene acceso a esa información antes del envío.",
          "Al enviar, la información viaja cifrada mediante una conexión segura (HTTPS) hacia el servidor del Portal.",
          "El servidor valida los datos y los archivos, genera dos documentos PDF (el expediente con sus respuestas y un archivo con sus documentos) y los envía por correo electrónico exclusivamente a los buzones institucionales autorizados de la Empresa.",
          "El Portal no guarda su información en bases de datos ni en almacenamiento propio: los datos solo existen en memoria durante el procesamiento del envío y se descartan al terminar.",
          "Los registros técnicos del Portal contienen únicamente el folio, la fecha y datos de funcionamiento; nunca el contenido del formulario ni de los documentos.",
        ] },
      ],
    },
    {
      id: "acceso", heading: "10. Quién puede ver su información dentro de la Empresa", blocks: [
        { p: "El acceso a su expediente está limitado al personal de la Empresa que lo necesita para cumplir las finalidades de este aviso, como las áreas de cumplimiento, administración y finanzas, jurídico y la dirección, bajo el principio de mínimo privilegio." },
        { p: "Todo el personal con acceso está obligado a guardar confidencialidad, incluso después de terminar su relación con la Empresa, y tiene prohibido copiar, reenviar, imprimir o extraer la información fuera de los sistemas autorizados salvo que sea estrictamente necesario para su función. El uso indebido será sancionado conforme a las políticas internas y a la legislación aplicable." },
      ],
    },
    {
      id: "encargados", heading: "11. Proveedores tecnológicos (encargados)", blocks: [
        { p: "Para operar el Portal, la Empresa utiliza proveedores de servicios tecnológicos que actúan como encargados: alojamiento del sitio web, servicio de correo electrónico y un servicio de verificación contra accesos automatizados." },
        { p: "Estos proveedores únicamente transmiten, procesan o resguardan la información por cuenta de la Empresa y conforme a sus instrucciones; no pueden utilizarla para fines propios y están sujetos a obligaciones de confidencialidad y seguridad. Esta comunicación a encargados no constituye una transferencia en términos de la Ley." },
      ],
    },
    {
      id: "transferencias", heading: "12. Transferencias de datos", blocks: [
        { p: "La Empresa no transfiere sus datos personales a terceros sin su consentimiento. Únicamente podrá comunicarlos, sin necesidad de su consentimiento, en los casos previstos por la Ley, entre ellos:" },
        { list: [
          "Cuando lo requiera una autoridad competente mediante requerimiento fundado y motivado.",
          "Cuando sea necesario para cumplir una obligación legal, incluidas las de prevención de operaciones con recursos de procedencia ilícita.",
          "Cuando sea necesario para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial.",
        ] },
        { p: "En esos casos se comunicará solo la información mínima indispensable y se solicitará que se le dé tratamiento confidencial." },
      ],
    },
    {
      id: "arco", heading: "13. Derechos ARCO", blocks: [
        { p: "Usted tiene derecho a:" },
        { list: [
          "Acceso: conocer qué datos personales tenemos y cómo los utilizamos.",
          "Rectificación: solicitar la corrección de sus datos si están desactualizados, son inexactos o incompletos.",
          "Cancelación: solicitar que eliminemos sus datos cuando considere que no se están utilizando adecuadamente, sujeto a los plazos de conservación que exija la ley.",
          "Oposición: oponerse al uso de sus datos para fines específicos.",
        ] },
        { p: `Para ejercer estos derechos, envíe su solicitud al correo ${c.privacyEmail} indicando: (a) su nombre y un medio para comunicarle la respuesta; (b) copia de una identificación oficial o, en su caso, los documentos que acrediten la representación; (c) la descripción clara de los datos y del derecho que desea ejercer; (d) el folio de su solicitud, si lo tiene; y (e) cualquier otro elemento que facilite la localización de sus datos. Para solicitudes de rectificación, indique las modificaciones y adjunte la documentación que las sustente.` },
        { p: "La Empresa le responderá dentro de los plazos que establece la Ley, y si la solicitud resulta procedente la hará efectiva dentro de los plazos legales siguientes a la respuesta." },
      ],
    },
    {
      id: "revocacion", heading: "14. Revocación del consentimiento y limitación del uso", blocks: [
        { p: `Usted puede revocar el consentimiento otorgado o solicitar que limitemos el uso o la divulgación de sus datos, mediante solicitud al correo ${c.privacyEmail}, siguiendo el procedimiento de la sección 13.` },
        { p: "Tome en cuenta que no en todos los casos podremos atender su solicitud de inmediato, ya que es posible que por alguna obligación legal necesitemos seguir tratando sus datos. La revocación del consentimiento puede impedir que la Empresa continúe evaluando su solicitud o manteniendo la relación comercial." },
      ],
    },
    {
      id: "seguridad", heading: "15. Medidas de seguridad", blocks: [
        { p: "La Empresa mantiene medidas de seguridad administrativas, técnicas y físicas para proteger sus datos contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizados, entre ellas:" },
        { list: [
          "Cifrado de la información en tránsito mediante conexiones seguras (HTTPS/TLS).",
          "Política de seguridad del contenido del Portal que impide la ejecución de código no autorizado.",
          "Verificación contra envíos automatizados, límites de tamaño y de frecuencia de envíos.",
          "Validación del contenido real de cada archivo y eliminación de elementos activos (enlaces y código) de los documentos PDF recibidos.",
          "Procesamiento en memoria sin almacenamiento en el Portal.",
          "Entrega únicamente a buzones institucionales autorizados y acceso restringido al personal que lo necesita.",
          "Obligaciones de confidencialidad para el personal y los proveedores.",
        ] },
      ],
    },
    {
      id: "vulneraciones", heading: "16. Vulneraciones de seguridad", blocks: [
        { p: "Si ocurre una vulneración de seguridad que afecte de forma significativa sus derechos patrimoniales o morales, la Empresa se lo informará sin dilación, indicando la naturaleza del incidente, los datos comprometidos, las recomendaciones para proteger sus intereses y las acciones correctivas adoptadas." },
      ],
    },
    {
      id: "conservacion", heading: "17. Conservación y eliminación", blocks: [
        { p: "La Empresa conservará el expediente durante el tiempo necesario para cumplir las finalidades de este aviso, mientras exista la relación comercial y, posteriormente, durante los plazos de conservación que exijan las disposiciones fiscales, mercantiles y de prevención de operaciones con recursos de procedencia ilícita aplicables." },
        { p: "Concluidos esos plazos, los datos se bloquearán y después se eliminarán de forma segura. Si su solicitud no es aprobada, el expediente se conservará solo por el tiempo que exija la ley o que sea necesario para atender aclaraciones." },
      ],
    },
    {
      id: "rastreo", heading: "18. Cookies y tecnologías de rastreo", blocks: [
        { p: "El Portal no utiliza cookies de publicidad, de analítica ni de rastreo. Utiliza el almacenamiento temporal de la pestaña del navegador únicamente para conservar su avance mientras llena el formulario, y un servicio de verificación contra accesos automatizados que procesa datos técnicos mínimos del navegador con fines exclusivos de seguridad." },
      ],
    },
    {
      id: "menores", heading: "19. Menores de edad", blocks: [
        { p: "El Portal está dirigido a representantes de empresas. No está destinado a menores de edad y la Empresa no recaba intencionalmente sus datos." },
      ],
    },
    {
      id: "cambios", heading: "20. Cambios a este aviso", blocks: [
        { p: "Este aviso puede modificarse por cambios legales, en nuestras prácticas o en el funcionamiento del Portal. Cualquier cambio se publicará en esta misma página, indicando la fecha de la versión vigente. Si un cambio implica nuevas finalidades o transferencias que requieran su consentimiento, se lo solicitaremos." },
      ],
    },
    {
      id: "autoridad", heading: "21. Autoridad competente", blocks: [
        { p: "Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir ante la autoridad competente en materia de protección de datos personales, de conformidad con la Ley." },
      ],
    },
  ],
};
