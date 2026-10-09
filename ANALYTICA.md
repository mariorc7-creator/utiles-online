# Analítica — Papeles del Bebé

Última actualización: 09/10/2026

## Google Analytics 4

GA4 está configurado con el ID de medición:

- `G-YQ7QHVVWZV`

La integración se realiza mediante `/analytics.js` y sigue un enfoque de consentimiento previo:

- Google Analytics no se carga hasta que el usuario acepta la analítica.
- Si el usuario rechaza, la web funciona con normalidad y GA4 no se activa.
- La preferencia se guarda en `localStorage` bajo `papelesbebe_analytics_consent`.
- `allow_google_signals` está desactivado.
- `allow_ad_personalization_signals` está desactivado.

## Funnel principal

La estructura permite medir el funnel principal con pageviews y eventos:

- `/` = visita a la web
- `/checklist/` = inicio o reanudación de checklist
- `/checklist/completada/` = checklist completada

Eventos personalizados enviados a GA4 cuando existe consentimiento:

- `checklist_start`
- `checklist_completed`

Esto permite calcular:

- tasa de inicio = usuarios que llegan a `/checklist/` / usuarios de landing
- tasa de finalización = usuarios que llegan a `/checklist/completada/` / usuarios que pasan por `/checklist/`

## Privacidad

La política de privacidad en `/privacidad/` describe el uso de GA4 y deja claro que la analítica es opcional.

Las respuestas de la checklist siguen almacenándose localmente en el navegador. GA4 se utiliza para medir uso agregado de la web y no sustituye la lógica determinista de la checklist.

## Próximos pasos

- Extender `/analytics.js` a todas las landings SEO relevantes.
- Verificar recepción de pageviews y eventos en GA4 Realtime/DebugView.
- Conectar la propiedad GA4 con GSC Wizard para poder consultar sesiones, canales, páginas y conversiones desde el agente SEO.
