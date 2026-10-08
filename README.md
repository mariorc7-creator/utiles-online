# Papeles del Bebé — versión España

Paquete preparado el 08/10/2026.

## Incluye
- Portada nacional.
- Checklist para 17 comunidades autónomas + Ceuta + Melilla.
- Enlace sanitario regional según territorio.
- Revisión de ayudas autonómicas con enlace oficial.
- Conserva los evaluadores estatales ya existentes.
- Conserva el evaluador específico de Cataluña.
- Caso especial Galicia: Tarxeta Benvida 2026.
- Caso especial Andalucía: ayudas por parto múltiple.
- 19 landings regionales SEO.
- sitemap.xml con portada + 19 landings.
- robots.txt.

## Publicación
Sustituye en el repositorio:
- index.html
- app.js
- style.css
- robots.txt
- sitemap.xml

Añade además la carpeta:
- comunidades/

Vercel desplegará desde main.

## Criterio de seguridad informativa
Cuando no hay una ayuda concreta verificada y codificada, la web no promete importe
ni elegibilidad: dirige al portal oficial de la comunidad para comprobar la
convocatoria vigente.

## V2 — ayudas autonómicas verificadas añadidas
- Asturias 2026: 1.200 / 1.700 / 2.200 € según supuesto, renta familiar <= 45.000 €
- Comunidad de Madrid: 500 €/mes durante 24 meses, sujeto a edad/renta/residencia
- País Vasco: 200 €/mes de 0 a 4 años, con modalidades adicionales
- Aragón 2026: ayuda para parto/adopción múltiple, convocatoria 1–30 octubre
- Murcia 2026: hasta 2.500 € en supuestos específicos, convocatoria 1–15 octubre
- Cataluña: conserva evaluador específico 650/750 €
- Galicia: conserva Tarxeta Benvida
- Andalucía: conserva ayuda por parto múltiple


## V3 — rediseño visual
- estética cálida y familiar
- fondo crema y acentos pastel
- cabecera translúcida
- hero y CTA reforzados
- tarjetas y cuestionario más suaves
- resultados y ayudas más legibles
- responsive móvil rehecho
- lógica funcional intacta


## V4 — navegación y persistencia
- botón visible "Inicio" en la cabecera
- logo clicable hacia la portada
- recuperación real de respuestas desde localStorage
- tarjeta "Continuar mi checklist" al volver otro día
- reanuda automáticamente desde el primer paso pendiente
- si el cuestionario estaba completo, recupera directamente el resultado
- botón "Empezar de nuevo" que limpia respuestas y checks
- los datos siguen guardándose solo en el navegador del usuario

## V5 — SEO + validación de fecha
- bloque de enlazado interno SEO en portada
- nuevas landings: trámites bebé, ayudas nacimiento, alta Seguridad Social,
  deducción maternidad, tarjeta sanitaria, Registro Civil y empadronamiento
- hub de comunidades autónomas
- sitemap ampliado
- validación: no se aceptan fechas de nacimiento futuras

## V6 — confianza y SEO técnico
- Schema.org WebSite/WebPage en portada
- BreadcrumbList y WebPage en landings
- página de metodología editorial
- página de privacidad explicando localStorage
- 404 personalizada y noindex
- enlaces internos de metodología/privacidad en footer
- sitemap actualizado
- sin añadir cookies ni trackers

## V7 — contenido SEO de alta intención
- landing específica: ayuda natalidad Madrid 2026
- landing específica: ayuda hijos País Vasco 2026
- landing específica: ayuda nacimiento Asturias 2026
- landing específica: inscripción nacimiento Registro Civil
- FAQPage schema en las cuatro landings
- datos clave visibles en formato escaneable
- bloque de ayudas destacadas en portada
- más enlazado interno desde páginas generales
- sitemap ampliado

## V8 — conversión y analítica
- ruta `/checklist/` para medir inicios de checklist
- ruta `/checklist/completada/` para medir cuestionarios completados
- ambas rutas son `noindex` para evitar ruido SEO
- todos los CTA principales conducen a `/checklist/`
- las landings regionales pueden preseleccionar la comunidad
- microcopy de conversión: 1 minuto, sin cuenta, progreso guardado
- explicación visual del proceso en 3 pasos
- archivo `ANALYTICA.md` con el plan de medición
- preparada para Vercel Web Analytics sin hardcodear rutas internas de Analytics

## V9 — monetización preparada
- producto Premium definido en 9,90 € pago único
- landing `/premium/`
- upsell al terminar la checklist
- `config.js` para pegar la URL de Stripe Checkout/Payment Link
- páginas `/premium/gracias/` y `/premium/cancelado/`
- checkout NO activado todavía: falta crear el enlace de pago real
- checklist básica continúa siendo gratuita

## V10 — navegación + monetización visible
- navegación principal: Checklist / Ayudas / Trámites / Premium
- Premium visible en la cabecera
- teaser Premium discreto en portada
- CTA Premium secundario en páginas SEO
- comparación Gratis vs Premium
- señales de confianza en la landing Premium
- responsive para móvil sin saturar la cabecera

## V11 — leads para gestorías
- landing `/gestoria/`
- formulario para pedir contacto profesional
- consentimiento explícito para compartir el lead con una gestoría colaboradora
- CTA de gestoría en home y después de la checklist
- navegación Gestoría
- captura de comunidad, necesidad y origen del lead
- honeypot antispam
- función serverless `/api/lead.js`
- envío preparado mediante Resend
- privacidad ampliada para explicar este tratamiento
- archivo `LEADS-GESTORIAS.md` con pasos de activación

## V12 — Stripe test conectado
- Payment Link de prueba conectado:
  `https://buy.stripe.com/test_eVq28saFT1sMatzd0T5os00`
- botón Premium ya abre Stripe Checkout
- modo de prueba visible en la landing Premium
- `premiumTestMode: true`
- antes de lanzar producción, sustituir por un Payment Link LIVE y poner `premiumTestMode: false`

## V13 — ataque SEO inicial
- Asturias reforzada
- nueva landing València 400 €
- nueva landing Tarxeta Benvida 2026
- País Vasco reforzada
- badge de verificación y fecha de revisión
- enlaces oficiales visibles
- enlazado interno desde home y hub de ayudas
- sitemap ampliado
- SEO-ROADMAP-V13.md

## V14 — descubrimiento y navegación
- selector grande "Busca las ayudas de tu comunidad" en la home
- accesos rápidos a Asturias, Madrid, Galicia, País Vasco y València
- hub `/ayudas-nacimiento/` reconstruido como directorio visual
- listado de las 19 regiones
- ayudas destacadas visibles con importe/resumen
- breadcrumbs visibles en páginas SEO prioritarias
- navegación rápida dentro de páginas regionales
- mejora de enlazado interno sin añadir contenido SEO nuevo

## V15 — home intuitiva
- dos caminos principales visibles nada más entrar:
  - Crear mi checklist personalizada
  - Ver ayudas por comunidad
- selector de comunidad situado inmediatamente bajo el hero
- accesos rápidos a ayudas destacadas
- bloque "¿Qué necesitas?" con Ayudas / Trámites / Premium / Gestoría
- se reduce ruido comercial arriba para priorizar orientación
- responsive para móvil

## V16 — home limpia
- se elimina el bloque grande de dos tarjetas de la V15
- se mantiene "¿Qué necesitas?" como navegación principal
- buscador de ayudas por comunidad en formato compacto
- accesos rápidos a ayudas destacadas
- menos altura y menos sensación de bloques duplicados

## V17 — mensaje claro
- se elimina "checklist" de la primera impresión
- CTA principal: "Ver mis ayudas y trámites"
- explicación inmediata: 6 preguntas → ayudas, trámites y orden
- "¿Qué necesitas?" subido justo después del hero
- lenguaje centrado en beneficio, no en funcionalidad
- "checklist" queda para el resultado interno, no para captar al usuario
