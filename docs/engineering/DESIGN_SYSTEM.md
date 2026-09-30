# Sistema de diseño

Tokens existentes: colores, espaciado, radio y ancho de contenido en globals.css.
Componentes: Button, Field, Notice, SiteHeader y SiteFooter.
Reutilizar y extender antes de crear variantes de una sola pantalla.

## Reglas

- Una jerarquía clara con encabezados semánticos; no usar títulos solo por tamaño.
- Móvil primero; evitar scroll horizontal no intencional, texto truncado y CTAs ocultos.
- Etiquetas explícitas y errores asociados a campos. El servidor valida de nuevo.
- Botones para acciones; enlaces para navegación. No enlaces sin destino.
- Foco visible, navegación por teclado y enlace para saltar al contenido.
- No depender únicamente de color para comunicar estados.
- Preferir controles HTML nativos; un diálogo nuevo necesita foco, cierre y retorno de foco.
- Respetar prefers-reduced-motion. Evitar autoplay y movimiento decorativo obligatorio.
- Reservar dimensiones de imágenes y usar alternativas textuales relevantes.

## Objetivo de accesibilidad

Trabajar hacia WCAG 2.2 AA y comprobar teclado, contraste, zoom, estructura y
formularios. Un escáner automático no demuestra conformidad completa.
Referencia: https://www.w3.org/TR/WCAG22/

## Revisión visual

Verificar 360/390, 768 y 1440 px como muestras, además de zoom y contenido largo.
Capturar las pantallas relevantes; revisar estados vacíos, carga, errores y éxito
cuando existan. Los tamaños anteriores son muestras de QA, no dispositivos exclusivos.
