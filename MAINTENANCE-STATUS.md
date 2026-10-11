# Papeles del Bebé — Estado de mantenimiento

Última actualización: 11/10/2026

## Producción
- Dominio principal operativo en Vercel.
- `www.papelesdelbebe.es` conectado a Production.
- DNS gestionado en DonDominio.
- Registro `A` raíz configurado a `216.198.79.1`.
- `www` configurado mediante CNAME de Vercel.
- `vercel.json` mantiene redirección permanente 301 por host desde `papelesdelbebe.es/:path*` a `https://www.papelesdelbebe.es/:path*`.

## IA — PapelesIA
- Bot PapelesIA integrado mediante `/api/papelesia.js`.
- Usa la variable de entorno `OPENAI_API_KEY` en Vercel; la clave nunca se expone en el navegador.
- La checklist incorpora una capa IA opcional en `/checklist/completada/` mediante `ai-checklist.js`.
- El resultado base de la checklist sigue generándose con reglas deterministas de `app.js`.
- PapelesIA complementa el resultado: resume la situación, prioriza qué revisar y destaca comprobaciones importantes.
- La IA no sustituye los trámites base ni debe afirmar elegibilidad, importes, plazos o requisitos no verificados.
- El análisis IA reutiliza `/api/papelesia` para mantener una única integración de modelo y configuración.

## QA funcional
Se ha revisado el flujo principal de navegación, persistencia y checklist, además de estructura de rutas, sitemap y páginas pausadas.

Correcciones aplicadas:
- Corregido `Continuar mi checklist` desde la home.
- Corregido `Empezar de nuevo` con limpieza de estado y reinicio limpio.
- Añadido `qa-fixes.js` como capa de correcciones compatible con `app.js`.
- Añadida validación defensiva para impedir fechas de nacimiento futuras.
- PapelesIA cargado en `/checklist/` y `/checklist/completada/`.
- Canonicals de checklist unificados a `https://www.papelesdelbebe.es/...`.
- Premium y Gestoría mantienen `noindex, follow` mientras estén pausados y están fuera del sitemap.

## Estado SEO técnico — 11/10/2026
- Canonicals históricos detectados sin `www`: corregidos. La auditoría de las 13 URL actualmente no indexadas confirma canonical `www` correcto en todas ellas.
- Sitemap canónico: `https://www.papelesdelbebe.es/sitemap.xml`.
- Sitemap actual: 67 URL, sin errores ni warnings en Search Console.
- `/checklist/` y `/checklist/completada/` continúan fuera del sitemap por `noindex`, de forma intencionada.
- Indexing Tracker en el último chequeo documentado: 35 URL vigiladas, 22 indexadas y 13 no indexadas; 0 errores y 0 warnings.
- Las 13 URL no indexadas responden 200 y son indexables; no se ha detectado bloqueo técnico crítico, alto o medio.
- `SEO-OPORTUNIDADES-2026-10-11.md` contiene 30 oportunidades priorizadas para el Agente de Contenido.

## Cambios SEO aplicados el 11/10/2026
- Reforzado el hub `/comunidades/` con más contenido, enlaces internos y schema `CollectionPage`.
- Reforzado `/tramites-bebe/` como hub principal de trámites, con enlaces profundos a las guías específicas.
- Ampliado `/registro-civil-bebe/` y diferenciado de `/registro-civil-nacimiento/`.
- Ampliadas las herramientas de calendario y calculadora con contenido útil y schema `WebApplication`.
- Ajustados titles de Melilla, València y Tarxeta Benvida para evitar truncado y mejorar CTR potencial.
- Retiradas promociones visibles de Premium/Gestoría en páginas modificadas mientras los servicios continúan pausados.
- Añadida analítica a landings recientes donde faltaba.
- `sitemap.xml` actualizado con los `lastmod` de las páginas modificadas.

## Funciones temporalmente desactivadas

### Premium
El código y las rutas de Premium se conservan para una futura activación, pero se han retirado temporalmente de la navegación y de los principales puntos de conversión visibles.

Mientras esté pausado:
- `/premium/` se mantiene con `noindex, follow`.
- no aparece en el sitemap.

No eliminar:
- `/premium/`
- configuración de Stripe de pruebas
- lógica existente relacionada con Premium

### Gestoría
El código y la infraestructura de captación de leads se conservan para una futura activación, pero la Gestoría queda temporalmente fuera de la experiencia principal del usuario.

Mientras esté pausada:
- `/gestoria/` se mantiene con `noindex, follow`.
- no aparece en el sitemap.

No eliminar:
- `/gestoria/`
- `/api/lead.js`
- `LEADS-GESTORIAS.md`
- configuración preparada para Resend

## Pendientes coordinados Mantenimiento / SEO / Contenido
- Reauditar en producción las páginas modificadas tras el despliegue de Vercel.
- Vigilar indexación; evitar cambios agresivos mientras Google está incorporando URL de forma rápida.
- En cuanto Search Console muestre impresiones, priorizar consultas y páginas reales por posición/CTR.
- Revisar posible canibalización entre páginas de intención cercana cuando exista suficiente dato de impresiones.
- Extender PapelesIA a landings públicas solo cuando exista un patrón global mantenible.
- Preparar pruebas E2E automáticas del flujo de checklist.

## Criterio de mantenimiento
Premium y Gestoría están pausados, no descartados. Cualquier trabajo futuro debe mantener su código recuperable y evitar eliminar infraestructura asociada salvo decisión explícita posterior.

La checklist debe conservar una base determinista verificable. La IA se utilizará como capa de personalización, explicación y priorización, no como única fuente para decidir trámites o ayudas.

## Coordinación SEO
Mientras Premium y Gestoría estén pausados, el SEO debe priorizar:
- ayudas por nacimiento,
- trámites del bebé,
- páginas por comunidad autónoma,
- landings de ayudas concretas,
- checklist gratuita,
- herramientas gratuitas,
- PapelesIA como elemento diferencial de utilidad y experiencia de usuario.

No se deben potenciar mediante enlazado interno ni nuevos CTA las rutas de Premium o Gestoría hasta su reactivación.
