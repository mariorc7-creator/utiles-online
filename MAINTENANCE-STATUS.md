# Papeles del Bebé — Estado de mantenimiento

Última actualización: 09/10/2026

## Producción
- Dominio principal operativo en Vercel.
- `www.papelesdelbebe.es` conectado a Production.
- DNS gestionado en DonDominio.
- Registro `A` raíz configurado a `216.198.79.1`.
- `www` configurado mediante CNAME de Vercel.

## IA — PAPELESIA
- Bot PAPELESIA integrado en la web mediante `/api/papelesia.js`.
- Usa la variable de entorno `OPENAI_API_KEY` en Vercel; la clave nunca se expone en el navegador.
- La checklist incorpora una capa IA opcional en `/checklist/completada/` mediante `ai-checklist.js`.
- El resultado base de la checklist sigue generándose con reglas deterministas de `app.js`.
- PAPELESIA complementa el resultado: resume la situación, prioriza qué revisar y destaca comprobaciones importantes.
- La IA no sustituye los trámites base ni debe afirmar elegibilidad, importes, plazos o requisitos no verificados.
- El análisis IA reutiliza `/api/papelesia` para mantener una única integración de modelo y configuración.

## Funciones temporalmente desactivadas

### Premium
El código y las rutas de Premium se conservan para una futura activación, pero se han retirado temporalmente de la navegación y de los principales puntos de conversión visibles.

No eliminar:
- `/premium/`
- configuración de Stripe de pruebas
- lógica existente relacionada con Premium

### Gestoría
El código y la infraestructura de captación de leads se conservan para una futura activación, pero la Gestoría queda temporalmente fuera de la experiencia principal del usuario.

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
- Resultado de checklist: añadido bloque “Tu checklist, revisada con IA” con PAPELESIA.
- Hub de Ayudas: Premium y Gestoría comentados en navegación.
- Página de Trámites: Premium y Gestoría comentados en navegación y CTA Premium desactivado.
- PAPELESIA añadido como asistente conversacional de la web.

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
- PAPELESIA como elemento diferencial de utilidad y experiencia de usuario.

No se deben potenciar mediante enlazado interno ni nuevos CTA las rutas de Premium o Gestoría hasta su reactivación.
