# Unificación canonical www — completada 11/10/2026

Estado: **COMPLETADO**.

Se han corregido las 22 rutas detectadas con canonical sin `www`, unificando canonical, Open Graph y URLs de JSON-LD bajo:

`https://www.papelesdelbebe.es/`

Además:

- `sitemap.xml` mantiene únicamente URLs `www`.
- `robots.txt` apunta al sitemap oficial `https://www.papelesdelbebe.es/sitemap.xml`.
- Se añade redirección permanente 301 por host desde `papelesdelbebe.es/:path*` hacia `https://www.papelesdelbebe.es/:path*`.
- Los enlaces internos relativos se mantienen, porque resuelven directamente bajo el host canónico cuando el usuario navega por `www`.
- Tras despliegue, validar HTTP, canonicals y sitemap en producción y Google Search Console.

Rutas corregidas:

- `/comunidades/`
- `/comunidades/asturias/`
- `/comunidades/canarias/`
- `/comunidades/cantabria/`
- `/comunidades/castilla-la-mancha/`
- `/comunidades/castilla-y-leon/`
- `/comunidades/comunidad-de-madrid/`
- `/comunidades/comunidad-valenciana/`
- `/comunidades/extremadura/`
- `/comunidades/galicia/`
- `/comunidades/islas-baleares/`
- `/comunidades/la-rioja/`
- `/comunidades/pais-vasco/`
- `/comunidades/region-de-murcia/`
- `/comunidades/navarra/`
- `/ayuda-nacimiento-asturias/`
- `/ayudas-hijos-pais-vasco/`
- `/ayuda-natalidad-madrid/`
- `/registro-civil-nacimiento/`
- `/metodologia/`
- `/ayuda-nacimiento-valencia-2026/`
- `/tarxeta-benvida-2026/`
