# Papeles del Bebé — Coordinación común de agentes

Última actualización: 15/10/2026

Este documento es de aplicación para todos los agentes que trabajen sobre Papeles del Bebé: SEO, GEO, Contenido, Mantenimiento y cualquier agente auxiliar.

## Despliegues y Vercel
- Un HTTP 403 al abrir una URL de Preview protegida de Vercel NO debe interpretarse automáticamente como fallo de build o de despliegue.
- Antes de declarar bloqueo, comprobar el estado del deployment en Vercel y, si el Preview está protegido, usar el acceso autenticado/bypass temporal disponible para la URL de Vercel.
- Si el deployment está READY y producción pública responde correctamente, no reportar el 403 del Preview como caída de la web.
- Solo escalar como bloqueo si no se puede validar el deployment ni mediante el estado de Vercel, ni mediante acceso autenticado al Preview, ni comprobando la URL pública de producción.
- Cuando haya cambios listos para producción, verificar main, build, deployment READY y la URL pública antes de cerrar la tarea.

## Funciones pausadas
- Gestoría permanece pausada. `leadEnabled` debe seguir en false y `/api/lead` debe permanecer bloqueado en servidor hasta autorización expresa.
- Premium de pago permanece inactivo. `premiumLive` debe seguir en false.
- Stripe permanece inactivo, incluido QA público, hasta autorización expresa.
- No reactivar CTAs, checkout, captación de leads ni cobros sin autorización explícita del usuario.

## SEO, GEO y contenido
- Prioridad general: SEO 80 %, GEO 20 %.
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
- Mantenimiento coordina cambios técnicos y despliegues.
- Contenido coordina revisión, actualización y cobertura editorial.
- SEO/GEO priorizan páginas y mejoras según Search Console, indexación, intención de búsqueda y oportunidades de citación.
- Si un cambio afecta a más de un área, debe preservarse la compatibilidad entre agentes y evitar sobreescribir trabajo reciente de otro agente.
