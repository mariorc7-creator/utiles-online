# Papeles del Bebé — Estado Premium

Última actualización: 13/10/2026

## Estado actual
Premium está habilitado en **modo de prueba funcional**. Stripe continúa en TEST MODE y no se realizan cobros reales.

## Flujo disponible
1. El usuario completa `Mis ayudas y trámites`.
2. `/premium/` permite abrir una prueba del Plan Premium con las respuestas guardadas.
3. `/premium/plan/` genera en navegador un plan personalizado y determinista.
4. El plan contiene prioridades, calendario orientativo, documentos a preparar, ayudas/trámites a revisar y enlaces internos a guías.
5. El usuario puede imprimir o guardar el plan como PDF desde el navegador.
6. PapelesIA puede recibir un resumen del plan para explicarlo y priorizarlo, pero no decide elegibilidad.
7. El checkout de Stripe de prueba se mantiene separado para validar la experiencia de pago.
8. `/premium/gracias/` enlaza al Plan Premium después del flujo de prueba.

## Datos y privacidad
El plan lee la clave local `tramitesFacilesRespuestas` ya utilizada por el flujo personalizado. No se crea base de datos ni coste recurrente para generar el plan. Si no hay respuestas completas, el usuario puede completar el formulario o cargar un ejemplo de demostración.

## Seguridad antes de activar cobro real
No activar Stripe Live hasta implementar y probar verificación server-side del pago (webhook o sesión Checkout validada) y control de acceso/entrega. La versión actual de prueba permite evaluar el producto sin riesgo de cobrar a un usuario y no entregarle el plan.

## Rutas
- `/premium/` — presentación y prueba del producto.
- `/premium/plan/` — plan personalizado.
- `/premium/gracias/` — confirmación del flujo de prueba.
- `/premium/cancelado/` — cancelación del checkout.

## Criterio funcional
El Premium debe aportar valor real sobre la versión gratuita: ordenar y convertir las respuestas en un plan accionable. Las fechas mostradas son hitos de organización, no plazos legales universales, salvo cuando una guía específica verificada indique lo contrario.
