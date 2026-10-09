# Papeles del Bebé — Estado de mantenimiento

Última actualización: 09/10/2026

## Producción
- Dominio principal operativo en Vercel.
- `www.papelesdelbebe.es` conectado a Production.
- DNS gestionado en DonDominio.
- Registro `A` raíz configurado a `216.198.79.1`.
- `www` configurado mediante CNAME de Vercel.

## IA — PapelesIA
- Bot PapelesIA integrado mediante `/api/papelesia.js`.
- Usa la variable de entorno `OPENAI_API_KEY` en Vercel; la clave nunca se expone en el navegador.
- La checklist incorpora una capa IA opcional en `/checklist/completada/` mediante `ai-checklist.js`.
- El resultado base de la checklist sigue generándose con reglas deterministas de `app.js`.
- PapelesIA complementa el resultado: resume la situación, prioriza qué revisar y destaca comprobaciones importantes.
- La IA no sustituye los trámites base ni debe afirmar elegibilidad, importes, plazos o requisitos no verificados.
- El análisis IA reutiliza `/api/papelesia` para mantener una única integración de modelo y configuración.

## QA funcional — 09/10/2026
Se ha revisado el flujo principal de navegación, persistencia y checklist, además de estructura de rutas, sitemap y páginas pausadas.

Correcciones aplicadas:
- Corregido `Continuar mi checklist` desde la home. La home no contiene los nodos `#cuestionario` y `#resultado`, por lo que la llamada directa a `continuarProgreso()` podía lanzar un error JavaScript. Ahora redirige correctamente a `/checklist/`.
- Corregido `Empezar de nuevo` con limpieza de `tramitesFacilesRespuestas` y `tramitesFacilesCompletados`, seguida de un reinicio limpio en `/checklist/`.
- Añadido `qa-fixes.js` como capa de correcciones compatible con la lógica existente sin reescribir `app.js`.
- Añadida validación defensiva para impedir fechas de nacimiento futuras aunque se manipule el campo HTML.
- PapelesIA también está cargado dentro de `/checklist/` y `/checklist/completada/`, no solo en la home.
- Comprobada la existencia en el repositorio de los destinos principales de la home y de las páginas regionales enlazadas.
- Canonicals de `/checklist/` y `/checklist/completada/` unificados a `https://www.papelesdelbebe.es/...`.
- Premium y Gestoría estaban ocultos visualmente pero seguían siendo indexables. Se han cambiado a `noindex, follow` mientras estén pausados.
- Premium y Gestoría se han retirado del sitemap mientras estén pausados.
- Canonicals de Premium y Gestoría actualizados al hostname definitivo con `www`.

Pendientes de QA/SEO coordinado:
- Homogeneizar progresivamente todas las URLs canónicas del resto de páginas internas al hostname definitivo `www.papelesdelbebe.es`; algunas landings históricas pueden conservar todavía canonicals sin `www`.
- Extender PapelesIA al resto de landings públicas cuando se decida un patrón global de carga, evitando mantener manualmente el mismo script en decenas de páginas.
- Preparar pruebas E2E automáticas del flujo de checklist para detectar regresiones en guardar, reanudar, reiniciar y completar.

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

## Cambios aplicados el 09/10/2026
- Home: Premium y Gestoría comentados en navegación y bloque “¿Qué necesitas?”.
- Cabecera home: eliminado el distintivo “Independiente · España”.
- Checklist: Premium y Gestoría comentados en navegación.
- Resultado de checklist: upsells de Premium y Gestoría ocultos temporalmente.
- Resultado de checklist: añadido bloque “Tu checklist, revisada con IA” con PapelesIA.
- Hub de Ayudas: Premium y Gestoría comentados en navegación.
- Página de Trámites: Premium y Gestoría comentados en navegación y CTA Premium desactivado.
- PapelesIA añadido como asistente conversacional de la web.
- Correcciones QA de persistencia/reinicio y validación de fecha añadidas mediante `qa-fixes.js`.
- Premium y Gestoría retirados del sitemap y marcados `noindex` durante la pausa.

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
- PapelesIA como elemento diferencial de utilidad y experiencia de usuario.

No se deben potenciar mediante enlazado interno ni nuevos CTA las rutas de Premium o Gestoría hasta su reactivación.
