# Papeles del Bebé — Estado de mantenimiento

Última actualización: 09/10/2026

## Producción
- Dominio principal operativo en Vercel.
- `www.papelesdelbebe.es` conectado a Production.
- DNS gestionado en DonDominio.
- Registro `A` raíz configurado a `216.198.79.1`.
- `www` configurado mediante CNAME de Vercel.

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
- Checklist: Premium y Gestoría comentados en navegación.
- Resultado de checklist: upsells de Premium y Gestoría ocultos temporalmente.
- Hub de Ayudas: Premium y Gestoría comentados en navegación.
- Página de Trámites: Premium y Gestoría comentados en navegación y CTA Premium desactivado.

## Criterio de mantenimiento
Premium y Gestoría están pausados, no descartados. Cualquier trabajo futuro debe mantener su código recuperable y evitar eliminar infraestructura asociada salvo decisión explícita posterior.

## Coordinación SEO
Mientras Premium y Gestoría estén pausados, el SEO debe priorizar:
- ayudas por nacimiento,
- trámites del bebé,
- páginas por comunidad autónoma,
- landings de ayudas concretas,
- checklist gratuita.

No se deben potenciar mediante enlazado interno ni nuevos CTA las rutas de Premium o Gestoría hasta su reactivación.
