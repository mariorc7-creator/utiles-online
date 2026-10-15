# Mantenimiento pendiente de revisión — 15/10/2026

## Estado final
La PR #5 fue revisada por Organizador, completada, fusionada y desplegada en producción el 15/10/2026.

Cambios aplicados:
- `config.js`: `leadEnabled: false`.
- Premium desactivado: `premiumLive: false`.
- Stripe desactivado también en QA: `premiumTestCheckoutUrl: ""` y `premiumTestMode: false`.
- `/api/lead` bloqueado en servidor con respuesta `503`, sin procesar ni reenviar datos.

## Validaciones realizadas
- Build de preview correcto en Vercel.
- Producción desplegada desde `main` y estado `READY`.
- Premium y Gestoría mantienen `noindex` mientras sigan pausados.
- Portada, hub de trámites y hub de ayudas responden correctamente y mantienen canonical `www`.
- El bloqueo server-side de Gestoría evita que una llamada directa al endpoint procese datos.

## Nota importante sobre el 403 de Vercel
El `403 Forbidden` detectado por el Agente de Mantenimiento NO es un fallo de la web ni del deployment. Ocurre al intentar abrir mediante el conector una URL de Preview protegida por Vercel Authentication.

A partir de ahora, si un preview devuelve 403:
1. No tratarlo automáticamente como fallo de despliegue.
2. Comprobar primero el estado del deployment (`READY`/`ERROR`).
3. Para inspeccionar una Preview protegida, usar el mecanismo de acceso autenticado/bypass temporal de Vercel disponible en el conector (`get_access_to_vercel_url` o `web_fetch_vercel_url`).
4. Si el merge llega a `main`, verificar además el deployment de `production` y la web pública.
5. Solo escalar como bloqueo real si no se puede obtener acceso autenticado, el deployment está en `ERROR`, o producción no responde correctamente.

## Producción
Commit de merge de PR #5:
`aff8f4ebab76d736deadd8f0f98bc0013014b692`

Deployment de producción verificado como `READY`:
`dpl_4b6X7FzHTGved8yqogWE5HpvrS52`
