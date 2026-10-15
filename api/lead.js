export default async function handler(req, res) {

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido."
    });
  }

  // Gestoría está pausada. El bloqueo se aplica en servidor para que
  // ninguna llamada directa a /api/lead pueda procesar ni reenviar datos.
  return res.status(503).json({
    error: "El servicio de solicitudes profesionales todavía no está activado."
  });
}
