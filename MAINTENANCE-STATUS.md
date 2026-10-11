# Papeles del Bebé — Estado de mantenimiento

Última actualización: 11/10/2026

## Producción
- Dominio principal operativo en Vercel.
- `www.papelesdelbebe.es` conectado a Production.
- DNS gestionado en DonDominio.
- Registro `A` raíz configurado a `216.198.79.1`.
- `www` configurado mediante CNAME de Vercel.
- `vercel.json` mantiene redirección permanente 301 por host desde `papelesdelbebe.es/:path*` a `https://www.papelesdelbebe.es/:path*`.
- Vercel puede resolver la redirección del dominio apex antes de `vercel.json`; en producción la redirección debe considerarse válida si es permanente y termina en `www` sin bucles.

## IA — PapelesIA
- Bot PapelesIA integrado mediante `/api/papelesia.js`.
- Usa la variable de entorno `OPENAI_API_KEY` en Vercel; la clave nunca se expone en el navegador.
- La checklist incorpora una capa IA opcional en `/checklist/completada/` mediante `ai-checklist.js`.
- El resultado base de la checklist sigue generándose con reglas deterministas de `app.js`.
- PapelesIA complementa el resultado: resume la situación, prioriza qué revisar y destaca comprobaciones importantes.
- La IA no sustituye los trámites base ni debe afirmar elegibilidad, importes, plazos o requisitos no verificados.
- El análisis IA reutiliza `/api/papelesia` para mantener una única integración de modelo y configuración.
- `papelesia.js` expone ahora una interfaz de frontend reutilizable: `window.PapelesIA.open()`, `close()` y `prefill(texto, abrir)`.
- Las herramientas pueden enviar contexto mediante el evento `papelesia:prefill`. El texto se precarga para que el usuario decida si quiere enviarlo; no se lanza una consulta automáticamente.

## Simulador de ayudas — V1 implementada el 11/10/2026
Ruta pública: `/herramientas/buscador-ayudas/`.

La antigua selección territorial se ha convertido en un simulador gratuito de ayudas por nacimiento sin cambiar la URL, para conservar enlaces internos y señales SEO existentes.

### Entradas
- comunidad autónoma o ciudad autónoma,
- situación laboral principal,
- situación familiar,
- nacimiento múltiple,
- discapacidad reconocida de un progenitor.

### Salida
- prestaciones estatales que conviene revisar,
- deducción por maternidad,
- prestación de pago único en supuestos familiares especiales,
- prestación por nacimiento múltiple cuando procede revisarla,
- ayuda o guía autonómica prioritaria para los 19 territorios,
- guías adicionales de monoparentalidad y familia numerosa cuando corresponden.

### Arquitectura V1
- cálculo 100 % en navegador,
- cero llamadas a IA o APIs de pago para determinar el resultado,
- reglas deterministas y auditables,
- sin registro obligatorio,
- resultado orientativo: nunca se presenta como concesión administrativa,
- estado de la simulación guardado solo en `sessionStorage`, clave `papelesbebe_simulador_ayudas_v1`,
- evento `papelesbebe:simulacion-ayudas` preparado para integraciones futuras,
- PapelesIA actúa únicamente como capa opcional de explicación y priorización.

La siguiente evolución técnica será separar las reglas a un módulo/versionado de datos cuando aumenten las condiciones por renta, municipio, edad o convocatoria. No se deben añadir reglas de elegibilidad fina si no pueden mantenerse con fuentes oficiales y fecha de revisión.

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
- El simulador valida comunidad, situación laboral y situación familiar antes de calcular.
- El simulador enlaza cada resultado a una guía interna específica o territorial para comprobar requisitos y fuentes oficiales.
- El simulador no envía datos a PapelesIA hasta que el usuario decide usar el asistente y enviar su consulta.

## Estado SEO técnico — 11/10/2026
- Canonicals históricos detectados sin `www`: corregidos. La auditoría de las 13 URL actualmente no indexadas confirma canonical `www` correcto en todas ellas.
- Sitemap canónico: `https://www.papelesdelbebe.es/sitemap.xml`.
- Sitemap actual: 67 URL, sin errores ni warnings en Search Console.
- `/checklist/` y `/checklist/completada/` continúan fuera del sitemap por `noindex`, de forma intencionada.
- Indexing Tracker en el último chequeo documentado: 35 URL vigiladas, 22 indexadas y 13 no indexadas; 0 errores y 0 warnings.
- Las 13 URL no indexadas responden 200 y son indexables; no se ha detectado bloqueo técnico crítico, alto o medio.
- `SEO-OPORTUNIDADES-2026-10-11.md` contiene 30 oportunidades priorizadas para el Agente de Contenido.
- El simulador conserva la canonical histórica de `/herramientas/buscador-ayudas/` y actualiza title, description y schema `WebApplication` a la nueva función.

## Cambios SEO aplicados el 11/10/2026
- Reforzado el hub `/comunidades/` con más contenido, enlaces internos y schema `CollectionPage`.
- Reforzado `/tramites-bebe/` como hub principal de trámites, con enlaces profundos a las guías específicas.
- Ampliado `/registro-civil-bebe/` y diferenciado de `/registro-civil-nacimiento/`.
- Ampliadas las herramientas de calendario y calculadora con contenido útil y schema `WebApplication`.
- Ajustados titles de Melilla, València y Tarxeta Benvida para evitar truncado y mejorar CTR potencial.
- Retiradas promociones visibles de Premium/Gestoría en páginas modificadas mientras los servicios continúan pausados.
- Añadida analítica a landings recientes donde faltaba.
- `sitemap.xml` actualizado con los `lastmod` de las páginas modificadas.
- La portada enlaza directamente al simulador como herramienta principal.

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
- Preparar pruebas E2E automáticas del flujo principal y del simulador.
- Añadir comprobación automática de enlaces internos y 404 en CI.
- Extraer reglas del simulador a un módulo versionado cuando crezca la cobertura de condiciones.
- Añadir criterios de renta solo cuando estén documentados y exista una estrategia de mantenimiento por convocatoria.

## Criterio de mantenimiento
Premium y Gestoría están pausados, no descartados. Cualquier trabajo futuro debe mantener su código recuperable y evitar eliminar infraestructura asociada salvo decisión explícita posterior.

La checklist y el simulador deben conservar una base determinista verificable. La IA se utilizará como capa de personalización, explicación y priorización, no como única fuente para decidir trámites o ayudas.

Papeles del Bebé debe evolucionar de web informativa a plataforma de decisión asistida siguiendo este orden:
1. dato o regla verificable,
2. herramienta determinista gratuita,
3. explicación y priorización,
4. IA opcional,
5. monetización solo cuando el producto gratuito sea útil por sí mismo.

## Coordinación SEO
Mientras Premium y Gestoría estén pausados, el SEO debe priorizar:
- ayudas por nacimiento,
- trámites del bebé,
- páginas por comunidad autónoma,
- landings de ayudas concretas,
- checklist gratuita,
- herramientas gratuitas,
- simulador de ayudas,
- PapelesIA como elemento diferencial de utilidad y experiencia de usuario.

No se deben potenciar mediante enlazado interno ni nuevos CTA las rutas de Premium o Gestoría hasta su reactivación.