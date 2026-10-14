# GEO — Estado y línea de trabajo

Fecha de inicio: 2026-10-14

## Principio operativo
- Prioridad global: SEO 80 %, GEO 20 %.
- GEO se integra sobre contenido útil y ya válido para SEO; no se crearán páginas artificiales solo para motores generativos.
- Objetivo: aumentar la probabilidad de que Papeles del Bebé sea citado como fuente en respuestas de IA sin degradar rankings, UX ni precisión administrativa.

## Auditoría técnica inicial
### Crawlers
- `robots.txt` usa `User-agent: *` + `Allow: /`, por lo que no bloquea Googlebot, Bingbot ni OAI-SearchBot.
- No existe una regla específica para `OAI-SearchBot` en el repositorio.
- `vercel.json` solo contiene la redirección 301 del host sin `www` hacia `https://www.papelesdelbebe.es/`; no declara reglas de bloqueo de bots.
- Mantener acceso permitido salvo decisión estratégica posterior.

### Sitemaps
Actualmente `robots.txt` publica:
- `https://www.papelesdelbebe.es/sitemap.xml`
- `https://www.papelesdelbebe.es/sitemap-pack45.xml`
- `https://www.papelesdelbebe.es/sitemap-observatorio.xml`

## Estándar editorial GEO + SEO
Para las guías principales, cuando aplique y esté contrastado:
1. respuesta directa a la intención de búsqueda en la parte superior;
2. requisitos;
3. importe o cuantía;
4. plazos;
5. documentación;
6. pasos para solicitar o completar el trámite;
7. fuente oficial enlazada;
8. fecha de verificación/revisión;
9. FAQ solo cuando responda dudas reales;
10. datos estructurados únicamente cuando coincidan con el contenido visible.

No inventar elegibilidad, importes, fechas ni requisitos. Si una administración no publica un dato de forma clara, indicarlo.

## Observatorio
El Observatorio debe evolucionar hacia un activo de datos propio basado en fuentes oficiales, especialmente para:
- comparativas por comunidad autónoma;
- cuantías de ayudas;
- requisitos recurrentes;
- diferencias territoriales;
- fechas de actualización;
- cambios normativos o administrativos relevantes.

Las comparativas deben aportar valor original mediante normalización, clasificación y síntesis, no copiar tablas de terceros.

## Medición GEO
- GA4 está preparado para medir tráfico de referencia desde asistentes de IA cuando llegue.
- Baseline 2026-10-14: no se detecta todavía tráfico de referencia atribuible a ChatGPT, Perplexity, Copilot, Gemini, Claude u otros asistentes en el informe disponible.
- Google AI Overviews / AI Mode no se pueden separar de forma fiable del tráfico `google / organic` solo por referrer.
- Revisar periódicamente asistentes, landing pages, engagement y conversiones cuando exista volumen suficiente.

## Coordinación
### SEO
- Seleccionar páginas prioritarias según impresiones, posición y potencial de negocio.
- No sacrificar títulos, enlazado interno ni intención de búsqueda por formatos pensados solo para IA.

### Contenido
- Reforzar respuestas concretas, fuentes oficiales, fecha de revisión y completitud de intención.
- Mantener lenguaje claro y evitar contenido inflado o repetitivo.

### Mantenimiento
- Mantener acceso de crawlers, sitemaps, canonicals, rendimiento y schema válidos.
- No introducir bloqueos globales de bots sin revisar impacto SEO/GEO.

## Próximas acciones
1. Aplicar este estándar primero a las páginas indexadas con impresiones reales.
2. Reforzar las guías con posición aproximada 5-20 antes de crear contenido nuevo en masa.
3. Revisar schemas de las páginas principales y eliminar cualquier marcado que no represente contenido visible real.
4. Definir una plantilla de fuente oficial + fecha de verificación reutilizable.
5. Convertir el Observatorio en fuente de comparativas originales enlazables y citables.
6. Mantener seguimiento de tráfico referido por asistentes IA en GA4.
