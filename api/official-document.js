const SOURCES = {
  'madrid-hoja-padronal': 'https://sede.madrid.es/UnidadesDescentralizadas/UDCEstadistica/TramitesMunicipales/Ficheros/Hoja_padronal.pdf'
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const key = String(req.query?.doc || '');
  const source = SOURCES[key];
  if (!source) return res.status(404).json({ error: 'Documento no disponible' });

  try {
    const upstream = await fetch(source, {
      headers: {
        'User-Agent': 'PapelesDelBebe/1.0 (+https://www.papelesdelbebe.es)'
      }
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'La fuente oficial no ha devuelto el documento' });
    }

    const contentType = upstream.headers.get('content-type') || 'application/pdf';
    if (!contentType.toLowerCase().includes('pdf')) {
      return res.status(502).json({ error: 'La fuente oficial no ha devuelto un PDF válido' });
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="hoja-padronal-madrid.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(body);
  } catch (error) {
    console.error('official-document proxy error', error);
    return res.status(502).json({ error: 'No se ha podido cargar el documento oficial' });
  }
};
