# Papeles del Bebé — Coordinación común de agentes

Última actualización: 20/10/2026

Este documento es de aplicación para todos los agentes que trabajen sobre Papeles del Bebé: SEO, GEO, Contenido, Mantenimiento, Competencia y cualquier agente auxiliar.

## Contexto estructural obligatorio
Antes de preguntar al usuario por información técnica o estructural, revisar primero este documento y el repositorio.

Datos base del proyecto:
- Repositorio GitHub: `mariorc7-creator/utiles-online`.
- Rama principal: `main`.
- Dominio de producción: `https://www.papelesdelbebe.es`.
- Vercel está conectado a ese repositorio.
- Trabajar siempre desde el `main` más reciente antes de modificar archivos, porque otros agentes pueden estar trabajando en paralelo.
- No preguntar al usuario por repositorio, rama, dominio, entorno de producción o ubicación del proyecto si estos datos siguen documentados y accesibles.

Regla general: primero consultar contexto compartido, repositorio y estado actual; después actuar. Solo preguntar al usuario cuando falte un dato realmente necesario que no pueda obtenerse por herramientas, documentación o estado del proyecto.

## Principio de autonomía
- Los agentes deben ejecutar trabajo útil, no limitarse a describir lo que podrían hacer.
- Si existe una mejora segura, reversible y alineada con su función, deben implementarla sin pedir permiso previo.
- No pedir confirmación para tareas ya delegadas dentro de su ámbito.
- No escalar dudas menores ni bloqueos recuperables.
- Informar al usuario cuando haya cambios relevantes aplicados, un riesgo real, una decisión estratégica que sí requiera su criterio o un bloqueo que no pueda resolverse con las herramientas disponibles.
- Antes de modificar un archivo existente, obtener su versión/SHA más reciente para evitar pisar cambios de otros agentes.

## UX global obligatoria
- Todas las páginas públicas deben mostrar la misma cabecera global. No crear variantes locales de navegación por sección.
- La navegación maestra es: `Mis trámites`, `Ayudas`, `Herramientas`, `Guías`, `🧸 Preparativos`; el logo lleva a Inicio. Observatorio en recursos secundarios. En móvil inferior: Mis trámites, Ayudas, Herramientas, Preparativos.
- No mostrar en la cabecera `Gestoría`, badges tipo `Guía independiente · España`, botones locales `← Inicio` ni menús históricos.
- `global-ui.js` es la autoridad de navegación en cliente y debe cargarse mediante `analytics.js`; cualquier página nueva debe incluir `/analytics.js` salvo excepción técnica documentada.
- Si una página existente usa markup de cabecera antiguo, no debe romper la experiencia: la capa global debe sustituirlo por la cabecera maestra.
- El estado de progreso también debe sentirse único: Mi panel, checklist y guía imprimible no deben presentar progresos contradictorios para el mismo trámite.

## Responsabilidades por agente
### SEO / GEO / AEO / AIO
- Responsable de crecimiento orgánico y visibilidad en buscadores y sistemas generativos.
- Debe priorizar y ejecutar mejoras reales basadas en Search Console, indexación, CTR, posiciones, intención de búsqueda, enlazado interno, schema, fuentes, hubs y Observatorio.
- Prioridad general: SEO 80 %, GEO/AEO/AIO 20 %.
- No quedarse solo en auditorías si existe una mejora clara que pueda ejecutarse.
- Evitar churn diario sobre la misma URL sin nuevas señales.

### Contenido
- Responsable de cobertura editorial, calidad, actualización, fuentes oficiales, utilidad y confianza.
- Debe revisar y mejorar artículos sin esperar instrucciones página a página.
- Cada artículo realmente revisado debe reflejar la fecha real de revisión del día, incluso si no hubo cambios sustantivos, siempre que la revisión se haya realizado de verdad.
- Mantener coherencia entre fecha visible y metadatos/schema cuando aplique.

### Mantenimiento
- Responsable de estabilidad, QA, despliegues, SXO, CRO, accesibilidad, rendimiento, integridad técnica, endpoints y coordinación de producción.
- Debe resolver problemas técnicos recuperables antes de escalar.
- Si otros agentes dejan cambios preparados, debe ayudar a llevarlos a producción cuando estén validados.

### Competencia
- Responsable de detectar oportunidades, huecos de contenido, mejoras de producto, UX, autoridad y distribución.
- Debe convertir hallazgos en propuestas accionables para SEO, Contenido o Mantenimiento.
- No copiar contenido, hacer spam, comprar enlaces ni contactar terceros sin autorización.

### Organizador
- Responsable de resolver conflictos entre agentes, revisar PRs, completar bloqueos pendientes, fusionar cambios seguros y verificar producción.
- Debe mantener coherencia entre las distintas líneas de trabajo y evitar que un agente contradiga el estado real del proyecto.

## Despliegues y Vercel
- Un HTTP 403 al abrir una URL de Preview protegida de Vercel NO debe interpretarse automáticamente como fallo de build o de despliegue.
- Antes de declarar bloqueo, comprobar el estado del deployment en Vercel y, si el Preview está protegido, usar el acceso autenticado/bypass temporal disponible para la URL de Vercel.
- Si el deployment está READY y producción pública responde correctamente, no reportar el 403 del Preview como caída de la web.
- Solo escalar como bloqueo si no se puede validar el deployment ni mediante el estado de Vercel, ni mediante acceso autenticado al Preview, ni comprobando la URL pública de producción.
- Cuando haya cambios listos para producción, verificar main, build, deployment READY y la URL pública antes de cerrar la tarea.

## Funciones pausadas
- Gestoría permanece pausada. `leadEnabled` debe seguir en false y `/api/lead` debe permanecer bloqueado en servidor hasta autorización expresa.
- Premium queda retirado de toda la experiencia pública. No volver a añadir enlaces, CTAs, navegación ni bloques promocionales de Premium; mantener `premiumLive=false` y redirigir antiguas URLs Premium a `/mi-panel/`.
- Stripe permanece inactivo, incluido QA público, hasta autorización expresa.
- No reactivar CTAs, checkout, captación de leads ni cobros sin autorización explícita del usuario.

## SEO, GEO y contenido
- No crear páginas artificiales únicamente para GEO.
- Usar fuentes oficiales y mantener requisitos, importes, plazos y condiciones contrastados.
- Mantener canonicals www, sitemap, robots y datos estructurados coherentes con el contenido real.
- Evitar cambios cosméticos masivos que generen ruido sin mejorar utilidad, precisión o posicionamiento.

## Fechas de revisión editorial
- Cada vez que un artículo sea revisado editorialmente, debe actualizarse su fecha visible de revisión a la fecha real del día de esa revisión, aunque tras comprobar fuentes oficiales no sea necesario cambiar el contenido.
- La fecha de revisión debe significar que el contenido fue efectivamente revisado ese día; no se debe adelantar o renovar una fecha sin haber hecho la comprobación correspondiente.
- Cuando proceda, mantener coherente la fecha visible de revisión con los metadatos o datos estructurados usados por la página.
- Si no hubo cambios sustantivos, no presentar el artículo como “actualizado” por cambios de contenido; indicar simplemente que fue revisado/verificado en esa fecha.

## Coordinación
- Todos los agentes deben leer este documento como referencia operativa antes de escalar dudas estructurales.
- Mantenimiento coordina cambios técnicos y despliegues.
- Contenido coordina revisión, actualización y cobertura editorial.
- SEO/GEO priorizan páginas y mejoras según Search Console, indexación, intención de búsqueda y oportunidades de citación.
- Competencia alimenta oportunidades a los demás agentes.
- Si un cambio afecta a más de un área, debe preservarse la compatibilidad entre agentes y evitar sobreescribir trabajo reciente de otro agente.

## Directriz prioritaria de captación orgánica — 19/10/2026
- A partir de ahora, las optimizaciones SEO se decidirán por datos de Google Search Console e intención de búsqueda, no por la cantidad de páginas modificadas.
- Prioridad P0: identificar consultas con posición media entre 10 y 20 (inclusive) y al menos 20 impresiones en una ventana de 28 días, y trabajar para llevarlas al top 10 de Google.
- Para cada oportunidad, estudiar la consulta, la URL que aparece, su intención, el contenido que actualmente ofrece respuesta, el título/snippet, enlazado interno y competidores en la SERP antes de cambiar nada.
- Registrar línea base (consulta, URL, impresiones, clics, CTR y posición en 28 días), modificación e impacto posterior; no prometer resultados ni confundir oscilaciones de posición con mejora sostenida.
- Si Search Console está temporalmente inaccesible, no inventar métricas ni hacer cambios masivos como sustituto: documentar el bloqueo y usar los últimos datos fechados claramente hasta recuperar acceso.
- Evitar churn, cambios de fecha sin revisión real y creación de páginas nuevas cuando haya oportunidades verificadas más próximas al top 10.

## Lenguaje simple y rutas (20/10/2026)
- Una única ruta principal: Mis trámites (`/mi-panel/`), y dos rutas complementarias: Buscar ayudas y Herramientas.
- Evitar en interfaz: 'bloques', 'oportunidades', 'preparadores inteligentes' y promesas de elegibilidad.
- Mostrar requisitos excluyentes de ayudas en encabezados. Dar acceso antes del parto desde Inicio.
- Recordatorios optativos descargables sin recogida de datos personales.

## Política editorial SEO 20/10/2026
- No utilizar fechas globales como prueba de revisión documental individual. Mantener registro `/cambios/` con cambios reales y fuentes.
- No publicar autorías, credenciales, domicilio, NIF ni correos inventados. Aviso legal pendiente de completar por datos reales del titular, cuando autorice su publicación.
- `/mi-plan/` y `/herramientas/que-me-falta/` son rutas antiguas, con redirección HTTP hacia `/mi-panel/`; no crear nuevos contenidos indexables en ellas.
- Preferir URLs estables en futuras guías, sin crear versiones anuales duplicadas. Las antiguas requieren mapeo, 301 y análisis Search Console antes de moverlas.
- Auditar fichas por su aporte único, fuentes, requisitos excluyentes y casos reales; no producir fichas masivas cambiando nombres de comunidades.

## Técnica y transparencia (20/10/2026)
- Global UI lleva guarda de inicialización única; build y analítica no deben volver a ejecutar la misma barra de navegación o MutationObserver.
- Política de cookies `/cookies/` enlazada, con consentimiento opcional, que debe auditarse periódicamente contra scripts externos reales.
- Contacto `/contacto/` creado únicamente como página informativa, sin inventar dirección ni formulario operativo; pendiente de canal real.
- PageSpeed móvil y WhatsApp deben validarse externamente; no declarar score ni vista previa real sin prueba.

## Recordatorios por email — pendiente de infraestructura, 20/10/2026
- No habilitar formularios públicos para recoger emails hasta disponer de remitente verificado, proveedor de envío, programación duradera, sistema de baja y consentimiento registrable.
- `RESEND_API_KEY` y `PACK_EMAIL_FROM` no están configurados en Vercel producción (solo se han comprobado nombres de variables, sin divulgar valores).
- No reutilizar `/api/lead`, pausado por la gestoria. Nunca presentar un `mailto` o un envío inmediato como recordatorio programado.
- Alternativa ya operativa sin registro: recordatorios .ics en `/mi-panel/`. La suscripción por correo será completamente optativa y separada de ese flujo.

## Preparativos UX visual · 20/10/2026
- La portada Preparativos es un hub de cinco categorías visuales (cochecitos, sillas, sacaleches, tronas, cunas de viaje), sin lista de titulares largos ni ranking aparente.
- Cada categoría muestra tres escenarios, dos modelos en tarjetas, pros/precauciones y detalles bajo demanda. Mantener acceso a fabricante y declaraciones de comparación documental.
- No publicar fotos de producto sin derechos o licencias; no inventar precios, reviews ni ensayos. No convertir automáticamente URLs de fabricante en enlaces de afiliado.
