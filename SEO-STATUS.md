# SEO — Estado 2026-10-11

## Indexación
- Indexing Tracker: 35 URL monitorizadas.
- Último estado conocido: 22 indexadas, 13 no indexadas, 0 pendientes, 0 errores y 0 warnings.
- Las 13 no indexadas se han auditado individualmente: las 13 responden 200, son indexables y no presentan problemas críticos, altos ni medios.

## Canonical y host
- Las 13 URL no indexadas auditadas declaran canonical válido bajo `https://www.papelesdelbebe.es/`.
- La documentación de canonicals confirma la unificación a `www`.
- `vercel.json` mantiene redirección 301 por host desde `papelesdelbebe.es/:path*` a `https://www.papelesdelbebe.es/:path*`.

## Sitemap
- Sitemap canónico: `https://www.papelesdelbebe.es/sitemap.xml`.
- 67 URL publicadas en el sitemap actual.
- Search Console: 0 errores y 0 warnings de sitemap.
- `lastmod` actualizado en las páginas optimizadas el 11/10.
- `/checklist/` y `/checklist/completada/` continúan fuera del sitemap por `noindex`, de forma intencionada.

## Cambios SEO ejecutados 11/10
- `/herramientas/calendario-primeros-90-dias/`: contenido ampliado, title/meta, WebApplication + Breadcrumb schema, más enlazado interno y retirada de navegación Premium pausada.
- `/herramientas/calculadora-permiso-nacimiento/`: contenido ampliado, title/meta, WebApplication + Breadcrumb schema, enlaces internos y retirada de navegación Premium pausada.
- `/comunidades/`: hub ampliado, CollectionPage schema, title/meta orientados a ayudas + trámites, enlaces a hubs y retirada de Premium/Gestoría.
- `/familias-melilla-2026/`: title acortado y analítica añadida.
- `/ayuda-nacimiento-valencia-2026/`: title acortado, breadcrumbs reforzados, enlaces internos, analítica y retirada de Premium/Gestoría.
- `/tarxeta-benvida-2026/`: title acortado, breadcrumbs reforzados, enlaces internos, analítica y retirada de Premium/Gestoría.
- `/registro-civil-bebe/`: contenido ampliado y diferenciado de la guía específica de inscripción, enlazado interno reforzado y retirada de Premium/Gestoría.
- `/tramites-bebe/`: hub ampliado con pasos, enlaces profundos a trámites, ayudas, herramientas y documentación.
- `sitemap.xml`: `lastmod` actualizado para las URL modificadas.
- `SEO-OPORTUNIDADES-2026-10-11.md`: backlog de 30 oportunidades de contenido creado para Contenido/Mantenimiento.

## Pendiente
- Esperar recrawl/indexación de las 13 URL todavía fuera del índice; no se detecta bloqueo técnico que justifique cambios agresivos.
- Reauditar tras despliegue las páginas modificadas.
- Revisar canibalización entre `/registro-civil-bebe/` y `/registro-civil-nacimiento/` cuando existan impresiones; ahora se han diferenciado las intenciones.
- Mantener Premium y Gestoría sin promoción visible mientras sigan pausados.
- En cuanto aparezcan impresiones, priorizar optimización por consultas reales de Search Console en vez de crear contenido por volumen estimado.
