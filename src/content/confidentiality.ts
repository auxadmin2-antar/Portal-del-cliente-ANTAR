// BORRADOR para revisión jurídica. Obligaciones de confidencialidad que la Empresa asume
// frente al cliente respecto de toda la información enviada por el portal.
import { COMPANY, type LegalDocument } from "./legal.ts";

const c = COMPANY;

export const confidentialityAgreement: LegalDocument = {
  title: "Acuerdo de confidencialidad",
  version: "2026-09-30",
  status: "draft",
  summary: [
    `${c.tradeName} se obliga a mantener en estricta confidencialidad toda la información y los documentos que su empresa envíe por este portal.`,
    "La información solo se usará para evaluar su solicitud y administrar la relación comercial, solo la verá el personal autorizado y no se divulgará, venderá ni utilizará de forma indebida.",
    `Estas obligaciones continúan vigentes durante la relación y por ${c.confidentialityYears} años después; para los datos personales, de forma indefinida.`,
  ],
  sections: [
    {
      id: "partes", heading: "Partes", blocks: [
        { p: `Este Acuerdo de confidencialidad (en adelante, "el Acuerdo") se celebra entre ${c.legalName} (en adelante, "la Empresa"), con domicilio en ${c.address}, y la persona moral o física que envía su información a través del portal de alta de clientes, representada por la persona que acepta este Acuerdo (en adelante, "el Cliente"). La Empresa y el Cliente se denominan conjuntamente "las Partes".` },
      ],
    },
    {
      id: "declaraciones", heading: "Declaraciones", blocks: [
        { list: [
          "La Empresa declara que requiere recibir información del Cliente para integrar su expediente de conocimiento del cliente (KYC / CTC), evaluar su solicitud de alta y, en su caso, administrar la relación comercial.",
          "La Empresa declara que reconoce el carácter reservado y confidencial de dicha información y su valor para el Cliente y para las personas relacionadas con él.",
          "El Cliente declara que la persona que acepta este Acuerdo cuenta con las facultades suficientes para obligarlo y que la información que proporciona es veraz.",
          "Ambas Partes declaran que es su voluntad obligarse en los términos de las siguientes cláusulas.",
        ] },
      ],
    },
    {
      id: "objeto", heading: "Primera. Objeto", blocks: [
        { p: "El objeto de este Acuerdo es establecer las obligaciones de confidencialidad, reserva, no divulgación y uso restringido que la Empresa asume respecto de la Información Confidencial que reciba del Cliente a través del portal o con motivo de su solicitud." },
      ],
    },
    {
      id: "definicion", heading: "Segunda. Información Confidencial", blocks: [
        { p: "Se considera Información Confidencial toda la información, datos y documentos que el Cliente proporcione a la Empresa, sin importar su forma o medio y aunque no estén marcados como confidenciales, incluyendo de manera enunciativa mas no limitativa:" },
        { list: [
          "Datos generales, fiscales, corporativos y de constitución de la empresa del Cliente.",
          "Información sobre su estructura corporativa, accionistas, beneficiarios finales, administradores, directivos y representantes.",
          "Información bancaria, patrimonial y financiera, incluidas cuentas, fuentes de recursos y tenencias accionarias.",
          "Información sobre sus operaciones, negocios previstos, licencias, políticas internas, procedimientos de cumplimiento y certificaciones.",
          "Respuestas a declaraciones sobre antecedentes, investigaciones, procedimientos legales y relaciones con funcionarios públicos.",
          "Los documentos adjuntos, como actas, poderes, identificaciones, constancias, opiniones de cumplimiento y comprobantes.",
          "Los datos personales de cualquier persona física contenidos en lo anterior.",
          "Los documentos que la Empresa genere a partir de dicha información, como el expediente en PDF, resúmenes, análisis y evaluaciones.",
        ] },
      ],
    },
    {
      id: "exclusiones", heading: "Tercera. Excepciones", blocks: [
        { p: "No se considerará Información Confidencial aquella que la Empresa pueda demostrar que: (a) era del dominio público al momento de recibirla o lo fue después sin incumplimiento de este Acuerdo; (b) ya obraba legítimamente en su poder sin obligación de reserva; o (c) la recibió legítimamente de un tercero facultado para divulgarla sin restricción." },
        { p: "Estas excepciones no aplican a los datos personales, que siempre se tratarán conforme al Aviso de privacidad y a la legislación en la materia." },
      ],
    },
    {
      id: "obligaciones", heading: "Cuarta. Obligaciones de la Empresa", blocks: [
        { p: "La Empresa se obliga a:" },
        { list: [
          "Mantener la Información Confidencial en estricta reserva y no divulgarla, publicarla, comunicarla ni ponerla a disposición de terceros por ningún medio.",
          "Utilizarla única y exclusivamente para integrar el expediente, evaluar la solicitud del Cliente, cumplir obligaciones legales y, en su caso, administrar la relación comercial.",
          "Limitar el acceso al personal que lo necesite para esos fines, informándole del carácter confidencial de la información.",
          "Proteger la Información Confidencial con medidas de seguridad administrativas, técnicas y físicas al menos equivalentes a las que utiliza para su propia información más sensible, y en ningún caso inferiores a las razonables en la industria.",
          "Conservar la información solo en sistemas y buzones institucionales autorizados.",
          "No hacer copias, reproducciones, extractos o resúmenes salvo los estrictamente necesarios para los fines permitidos; todas las copias quedan sujetas a este Acuerdo.",
          "Informar al Cliente, tan pronto tenga conocimiento, de cualquier uso o divulgación no autorizados.",
        ] },
      ],
    },
    {
      id: "prohibiciones", heading: "Quinta. Prohibiciones expresas", blocks: [
        { p: "Queda expresamente prohibido a la Empresa, a su personal y a sus proveedores:" },
        { list: [
          "Vender, rentar, ceder, licenciar o comercializar la Información Confidencial.",
          "Utilizarla para obtener una ventaja comercial o competitiva, para fines de mercadotecnia o en perjuicio del Cliente o de las personas relacionadas.",
          "Compartirla con empresas del mismo grupo, socios o terceros para fines propios de éstos.",
          "Reenviarla a cuentas de correo personales o almacenarla en dispositivos o servicios no autorizados por la Empresa.",
          "Utilizarla para entrenar sistemas de inteligencia artificial o incorporarla a bases de datos con fines distintos a los permitidos.",
          "Utilizar los datos bancarios para cualquier operación no autorizada expresamente por el Cliente.",
        ] },
      ],
    },
    {
      id: "personal", heading: "Sexta. Personal autorizado", blocks: [
        { p: "La Empresa garantiza que su personal, empleados y colaboradores con acceso a la Información Confidencial están obligados por escrito a guardar confidencialidad en términos al menos tan estrictos como los de este Acuerdo, obligación que subsiste aun después de concluida su relación con la Empresa." },
        { p: "La Empresa será responsable frente al Cliente por cualquier incumplimiento cometido por su personal." },
      ],
    },
    {
      id: "proveedores", heading: "Séptima. Proveedores tecnológicos", blocks: [
        { p: "Los proveedores de alojamiento, correo electrónico y seguridad que utiliza el portal solo transmiten o resguardan la información por cuenta de la Empresa. La Empresa se obliga a utilizar proveedores que ofrezcan garantías de confidencialidad y seguridad y responderá por el tratamiento que realicen en su nombre." },
      ],
    },
    {
      id: "autoridad", heading: "Octava. Revelación por mandato legal", blocks: [
        { p: "Si una autoridad competente requiere a la Empresa, mediante mandamiento fundado y motivado, revelar Información Confidencial, la Empresa: (a) lo notificará al Cliente antes de hacerlo, siempre que la ley lo permita, para que éste pueda ejercer los medios de defensa que estime convenientes; (b) revelará únicamente la información estrictamente requerida; y (c) solicitará que se le otorgue tratamiento confidencial." },
      ],
    },
    {
      id: "incidentes", heading: "Novena. Incidentes de seguridad", blocks: [
        { p: "En caso de pérdida, robo, acceso no autorizado o cualquier incidente que comprometa la Información Confidencial, la Empresa lo notificará al Cliente sin dilación, describiendo la naturaleza del incidente, la información afectada, las medidas adoptadas y las recomendaciones para mitigar sus efectos, y colaborará con el Cliente para contenerlo." },
      ],
    },
    {
      id: "propiedad", heading: "Décima. Propiedad de la información", blocks: [
        { p: "La Información Confidencial es y seguirá siendo propiedad del Cliente o de sus titulares. Este Acuerdo no otorga a la Empresa ningún derecho, licencia ni titularidad sobre ella, salvo el derecho limitado de utilizarla para los fines permitidos." },
      ],
    },
    {
      id: "devolucion", heading: "Decimoprimera. Conservación, devolución y destrucción", blocks: [
        { p: "La Empresa conservará la Información Confidencial solo durante el tiempo necesario para los fines permitidos y los plazos que exija la legislación aplicable." },
        { p: "Concluidos esos plazos, o antes si el Cliente lo solicita por escrito y no existe obligación legal de conservarla, la Empresa destruirá de forma segura la información y sus copias y, a petición del Cliente, emitirá una constancia de destrucción." },
      ],
    },
    {
      id: "vigencia", heading: "Decimosegunda. Vigencia", blocks: [
        { p: `Este Acuerdo entra en vigor en el momento en que el Cliente lo acepta en el portal y permanecerá vigente mientras exista la relación entre las Partes y durante ${c.confidentialityYears} años posteriores a su terminación, o a la fecha de envío si la solicitud no es aprobada.` },
        { p: "Las obligaciones relativas a datos personales y a información que constituya secreto industrial o comercial subsistirán de manera indefinida." },
      ],
    },
    {
      id: "responsabilidad", heading: "Decimotercera. Responsabilidad", blocks: [
        { p: "El incumplimiento de este Acuerdo obligará a la Empresa a indemnizar al Cliente por los daños y perjuicios que le cause, sin perjuicio de las responsabilidades civiles, administrativas o penales que correspondan conforme a la legislación en materia de revelación de secretos, secretos industriales y protección de datos personales." },
      ],
    },
    {
      id: "privacidad", heading: "Decimocuarta. Relación con el Aviso de privacidad", blocks: [
        { p: "Este Acuerdo complementa el Aviso de privacidad publicado en el portal. En caso de diferencia entre ambos, prevalecerá la disposición que otorgue mayor protección al Cliente y a los titulares de los datos personales." },
      ],
    },
    {
      id: "reciproca", heading: "Decimoquinta. Confidencialidad del Cliente", blocks: [
        { p: "El Cliente se obliga a su vez a mantener en reserva la información no pública de la Empresa que llegue a conocer con motivo de su solicitud, y a utilizarla solo para los fines de ésta." },
      ],
    },
    {
      id: "generales", heading: "Decimosexta. Disposiciones generales", blocks: [
        { list: [
          "Si alguna cláusula resulta inválida, las demás conservarán su validez.",
          "La falta o demora en el ejercicio de un derecho no implica renuncia a él.",
          "Cualquier modificación a este Acuerdo se publicará en el portal con una nueva versión; la versión aceptada por el Cliente queda registrada en su expediente.",
        ] },
      ],
    },
    {
      id: "aceptacion", heading: "Decimoséptima. Aceptación por medios electrónicos", blocks: [
        { p: "El Cliente manifiesta su consentimiento con este Acuerdo al marcar la casilla de aceptación y enviar el formulario, conforme a la legislación aplicable al consentimiento expresado por medios electrónicos. El portal registra en el expediente el nombre y cargo de quien acepta, la fecha y hora, el folio y la versión de este Acuerdo." },
      ],
    },
    {
      id: "jurisdiccion", heading: "Decimoctava. Legislación aplicable y jurisdicción", blocks: [
        { p: `Este Acuerdo se rige por las leyes federales de los Estados Unidos Mexicanos. Para su interpretación y cumplimiento, las Partes se someten a los tribunales competentes de ${c.jurisdiction}, renunciando a cualquier otro fuero que pudiera corresponderles.` },
      ],
    },
  ],
};
