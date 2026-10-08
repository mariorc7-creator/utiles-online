# Analítica de lanzamiento — Papeles del Bebé V8

La V8 crea un funnel que se puede medir únicamente con pageviews:

- `/` = visita a la web
- `/checklist/` = persona que empieza o retoma la checklist
- `/checklist/completada/` = persona que completa las 6 preguntas

Esto permite calcular:
- tasa de inicio = visitas a `/checklist/` / visitas a landing
- tasa de finalización = visitas a `/checklist/completada/` / visitas a `/checklist/`

## Vercel Web Analytics
No se ha hardcodeado ningún script porque Vercel Web Analytics v2 genera un
`<unique-path>` específico del proyecto al habilitarlo.

Pasos cuando quieras activarlo:
1. Vercel → proyecto `utiles-online` → Analytics.
2. Pulsa Enable.
3. Sigue la implementación HTML que muestre Vercel para el proyecto.
4. Haz un nuevo deployment.
5. Comprueba que aparecen pageviews de `/`, `/checklist/` y `/checklist/completada/`.

Vercel Web Analytics usa medición first-party sin cookies de seguimiento.
No se han añadido Google Analytics, Meta Pixel ni trackers externos en esta V8.
