# SEO y contenido

## Por página pública

Título y descripción propios, H1 coherente, canonical absoluto hacia la página
correcta y contenido útil. La plantilla define canonical solo en la home; no
heredarlo globalmente hacia todas las rutas. Adaptar locale de Open Graph al mercado.
Añadir imagen social real, alt, dimensiones y permisos de uso antes del lanzamiento.

Sitemap incluye únicamente páginas canónicas publicadas. No inventar lastModified
con la fecha de cada build. Para renombrar slugs, mapear redirects y actualizar enlaces.
No crear datos estructurados de valoraciones o empresas inexistentes.

## Protección de previews

SITE_INDEXABLE es false por defecto. La plantilla requiere VERCEL_ENV=production
y el opt-in explícito para indexar. Preview entrega meta robots y X-Robots-Tag
noindex, robots disallow y sitemap vacío. La indexación se decide en build.
Esto no impide que alguien con la URL vea el sitio: configurar protección de
despliegues para previews confidenciales.

robots.txt no elimina URLs ya indexadas ni sustituye permisos. Si una URL ya
aparece en buscadores, evaluar su proceso de retirada y permitir que el buscador
observe la señal adecuada de noindex cuando corresponda.

## Contenido

Sin testimonios o cifras inventadas, enlaces vacíos, copy legal genérico publicado
sin revisión ni promesas de rendimiento no medidas. Separar borrador y contenido
final. Registrar fuente, autor/responsable y fecha de revisión cuando sea útil.

Referencia de metadata: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
