export default async function handler(req, res) {

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido."
    });
  }


  const {
    nombre,
    email,
    telefono,
    comunidad,
    necesidad,
    mensaje,
    origen,
    consentimiento,
    empresa
  } = req.body || {};


  // Honeypot: bots suelen rellenar este campo invisible.
  if (empresa) {
    return res.status(200).json({
      ok: true
    });
  }


  if (
    !nombre ||
    !email ||
    !comunidad ||
    !necesidad ||
    consentimiento !== true
  ) {

    return res.status(400).json({
      error: "Completa los campos obligatorios y acepta el consentimiento."
    });

  }


  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  if (!emailValido) {

    return res.status(400).json({
      error: "Introduce un email válido."
    });

  }


  const apiKey =
    process.env.RESEND_API_KEY;

  const destinatario =
    process.env.LEADS_TO_EMAIL;

  const remitente =
    process.env.LEADS_FROM_EMAIL;


  if (
    !apiKey ||
    !destinatario ||
    !remitente
  ) {

    return res.status(503).json({
      error:
        "El servicio de solicitudes profesionales todavía no está activado."
    });

  }


  const escapar = value =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");


  const contenido = `
    <h2>Nuevo lead — Papeles del Bebé</h2>

    <p><strong>Nombre:</strong> ${escapar(nombre)}</p>

    <p><strong>Email:</strong> ${escapar(email)}</p>

    <p><strong>Teléfono:</strong> ${escapar(telefono)}</p>

    <p><strong>Comunidad:</strong> ${escapar(comunidad)}</p>

    <p><strong>Necesidad:</strong> ${escapar(necesidad)}</p>

    <p><strong>Origen:</strong> ${escapar(origen)}</p>

    <p><strong>Mensaje:</strong></p>

    <p>${escapar(mensaje).replace(/\n/g, "<br>")}</p>

    <hr>

    <p>
      El usuario ha marcado expresamente la casilla
      de consentimiento para gestionar esta solicitud
      y compartir sus datos con una gestoría colaboradora.
    </p>
  `;


  try {

    const respuesta =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${apiKey}`,
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            from: remitente,
            to: [destinatario],
            reply_to: email,
            subject:
              `Lead gestoría · ${comunidad} · ${nombre}`,
            html: contenido
          })
        }
      );


    if (!respuesta.ok) {

      const detalle =
        await respuesta.text();

      console.error(
        "Resend error:",
        detalle
      );


      return res.status(502).json({
        error:
          "No hemos podido registrar la solicitud. Inténtalo de nuevo más tarde."
      });

    }


    return res.status(200).json({
      ok: true
    });


  } catch (error) {

    console.error(
      "Lead API error:",
      error
    );


    return res.status(500).json({
      error:
        "Ha ocurrido un error al enviar la solicitud."
    });

  }

}
