# Activar los leads de gestorías

La V11 ya incluye:
- landing `/gestoria/`
- formulario de lead
- consentimiento explícito
- origen del lead
- honeypot antispam
- endpoint serverless `/api/lead`
- envío por email usando Resend

## Antes de activarlo

### 1. Crear una cuenta en Resend
Necesitas una API key de Resend para que Vercel pueda enviar los leads por email.

### 2. Añadir variables de entorno en Vercel

Proyecto → Settings → Environment Variables

Añade:

`RESEND_API_KEY`
La API key de Resend.

`LEADS_TO_EMAIL`
El email donde quieres recibir los leads.

`LEADS_FROM_EMAIL`
Una dirección de remitente verificada en Resend, por ejemplo:
`Papeles del Bebé <leads@papelesdelbebe.es>`

### 3. Nuevo deployment
Después de crear las variables de entorno, haz Redeploy.

### 4. Probar
Entra en:
`/gestoria/`

Envía un formulario de prueba y confirma que recibes el email.

## Modelo comercial posterior

No compartas leads con una gestoría hasta tener un acuerdo comercial y condiciones de tratamiento de datos claras.

Opciones:
- precio por lead válido
- comisión por cliente cerrado
- cuota mensual por zona/comunidad
- exclusividad por provincia

Recomendación inicial:
empezar con 1–3 gestorías y negociar pago por lead cualificado.
