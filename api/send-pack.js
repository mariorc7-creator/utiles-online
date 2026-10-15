const PACKS = {
  empadronamiento: {
    subject: 'Tu pack para empadronar al bebé · Papeles del Bebé',
    title: 'Pack práctico: empadronamiento del bebé',
    intro: 'Antes de presentar nada, comprueba si el bebé ya consta de alta y revisa siempre los requisitos de tu ayuntamiento.',
    bullets: [
      'Identificación de progenitores o responsables, según el procedimiento municipal.',
      'Documento que acredita el nacimiento del menor, cuando se solicite.',
      'Documentación del domicilio que exija o compruebe el ayuntamiento.',
      'Formulario u hoja padronal oficial del municipio.',
      'Guardar resguardo, volante o certificado tras la gestión.'
    ],
    url: 'https://www.papelesdelbebe.es/pack-empadronamiento/'
  }
};

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const packId = String(req.body?.pack || '');
  const pack = PACKS[packId];
  if (!pack) return res.status(400).json({ error: 'Pack no válido.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) {
    return res.status(400).json({ error: 'Introduce un email válido.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PACK_EMAIL_FROM;
  if (!apiKey || !from) {
    return res.status(503).json({ error: 'El envío automático por email todavía no está configurado.' });
  }

  const bullets = pack.bullets.map((item) => `<li style="margin:0 0 8px">${escapeHtml(item)}</li>`).join('');
  const html = `<!doctype html><html><body style="margin:0;background:#f6f7fb;font-family:Arial,sans-serif;color:#20283c"><div style="max-width:620px;margin:0 auto;padding:28px 18px"><div style="background:white;border-radius:18px;padding:28px;border:1px solid #e5e7f2"><div style="font-weight:800;color:#5b61d8;margin-bottom:10px">Papeles del Bebé</div><h1 style="font-size:24px;line-height:1.2;margin:0 0 12px">${escapeHtml(pack.title)}</h1><p style="line-height:1.6;color:#596176">${escapeHtml(pack.intro)}</p><ul style="padding-left:20px;line-height:1.5">${bullets}</ul><p style="margin:24px 0 0"><a href="${pack.url}" style="display:inline-block;background:#666df5;color:#fff;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:10px">Abrir el pack completo</a></p><p style="font-size:12px;line-height:1.5;color:#7b8395;margin-top:22px">Este correo es transaccional: te lo enviamos porque lo has solicitado. No te suscribe a comunicaciones comerciales. Los requisitos del padrón dependen del municipio; confirma siempre la información en la sede oficial de tu ayuntamiento.</p></div></div></body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [email], subject: pack.subject, html })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('send-pack email provider error', response.status, detail.slice(0, 500));
      return res.status(502).json({ error: 'El proveedor de correo no ha podido completar el envío.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('send-pack failed', error);
    return res.status(502).json({ error: 'No hemos podido completar el envío.' });
  }
}
