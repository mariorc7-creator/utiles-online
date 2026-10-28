# Papeles del Bebé — identidad editorial de los cómics

## Formato y estilo
- Una única imagen 1080 × 1350, con cuatro viñetas en cuadrícula 2×2, idéntica para Instagram y X.
- Estética de comedia animada televisiva de los 90: personajes propios de piel amarilla, expresiones teatrales, ojos grandes, líneas negras expresivas, colores saturados y fondos ricos en detalles. No reproducir personajes existentes.
- Familia recurrente original: padre de pelo castaño con barba y camiseta turquesa, madre de pelo recogido y camiseta coral, bebé de pelo castaño. Secundarios de guardería, administración, etc.
- La IA dibuja el cómic COMPLETO con los bocadillos integrados. No añadir banners, numeraciones, logos o etiquetas @ de nuestra propia cuenta.

## Voz editorial
- Humor inteligente, irónico, ligeramente macarra / troll, nunca paternalista ni corporativo.
- Debe hacer reír y detener el scroll: gancho en cuadro 1, escalada en 2, giro en 3, remate fuerte en 4.
- Situaciones reales de crianza, guarderías, conciliación, burocracia y preparativos, con giro absurdo visual.
- Evitar remates genéricos, repetir siempre lo mismo, chistes flojos y moralinas.
- Vinculación NATURAL con la web papelesdelbebe.es: guías de trámites, ayudas autonómicas, checklists, preparativos, invitaciones, tarjetas de hitos, herramientas gratuitas. En el texto de publicación, aludir a recursos útiles solo si encaja; no meter propaganda en la viñeta.
- Texto breve y legible en móvil, español de España.
- No inventar cifras, prestaciones, legislación, requisitos ni noticias. Si hay contenidos informativos reales, verificar antes de publicarlos.
- Instagram: de dos a tres hashtags temáticos pertinentes; X: como máximo uno. Nunca etiquetar @papelesdelbebe en nuestra propia publicación.

## Automatización
- GitHub Actions genera el cómic lunes, miércoles y viernes, lo aloja y lo añade a la cola de Buffer tanto en Instagram como en X.
- Buffer decide la publicación según los horarios y huecos disponibles.
- El workflow dispone de modo manual preview para probar sin publicar.
- La generación de calidad alta usa la API de OpenAI y conlleva coste; monitorizar consumo y revisar periódicamente la calidad.
