# Mantenimiento pendiente de revisión — 15/10/2026

## Alcance
Preparación sin despliegue: no fusionar automáticamente sin comprobar el comportamiento en staging.

## Cambio aplicado en esta rama
- `config.js`: `leadEnabled: false` para respetar la decisión de mantener Gestoría pausada.

## Pendientes antes de producción (P0)
- Verificar que la interfaz no muestra CTAs activos de Gestoría ni Premium.
- Revisar `/api/lead`: la bandera de cliente NO constituye protección del endpoint. Bloquear el envío en servidor mientras Gestoría esté pausada.
- Revisar todos los accesos a Stripe, incluido el enlace de prueba. No activar cobros ni Premium.
- Verificar que la checklist continúa determinista y que PAPELESIA solo la complementa.

## Validaciones SEO y SXO (P1)
- Canonicals absolutos con https://www.papelesdelbebe.es, redirección del dominio sin www, sitemap y robots.
- Revisar páginas indexables, errores 404, navegación, responsive, accesibilidad y Core Web Vitals.
- Medir el embudo checklist_start / checklist_completed únicamente con consentimiento, sin enviar respuestas familiares, fechas de nacimiento, datos de menores ni identificadores personales.
- Comprobar GA4 en entorno de prueba y no duplicar eventos.

## Procedimiento del organizador
1. Revisar diferencias contra main reciente y resolver conflictos.
2. Completar protección server-side de Gestoría y revisar accesos Premium.
3. Ejecutar pruebas funcionales y SEO.
4. Fusionar y desplegar únicamente tras validación.
5. Comprobar producción, dominio www, endpoints y analítica; documentar commit y fecha.

## Bloqueo
La integración Vercel del agente devuelve 403 en el equipo mario-herramientas. El panel web del propietario sí muestra producción Ready, pero no permite verificarla mediante el conector.
