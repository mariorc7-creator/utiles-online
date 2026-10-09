(() => {
  if (document.getElementById('papelesia-launcher')) return;

  const style = document.createElement('style');
  style.textContent = `
    #papelesia-launcher{position:fixed;right:22px;bottom:22px;z-index:1000;border:0;border-radius:999px;background:linear-gradient(135deg,#6f7cf7,#8792ff);color:#fff;font-weight:900;padding:14px 18px;box-shadow:0 14px 35px rgba(89,102,229,.3);cursor:pointer;display:flex;align-items:center;gap:8px}
    #papelesia-launcher:hover{transform:translateY(-2px)}
    #papelesia-panel{position:fixed;right:22px;bottom:82px;width:min(390px,calc(100vw - 28px));height:min(590px,calc(100vh - 120px));z-index:1001;background:#fff;border:1px solid #e8e2dc;border-radius:22px;box-shadow:0 24px 70px rgba(34,48,74,.22);display:none;overflow:hidden;font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #papelesia-panel.abierto{display:flex;flex-direction:column}
    .papelesia-head{padding:16px 17px;background:linear-gradient(135deg,#f6f3ff,#fff5f0);border-bottom:1px solid #eee7e2;display:flex;align-items:center;justify-content:space-between;gap:12px}
    .papelesia-identidad{display:flex;align-items:center;gap:10px}.papelesia-avatar{width:40px;height:40px;border-radius:13px;background:#eef0ff;display:grid;place-items:center;font-size:20px}.papelesia-identidad strong{display:block;color:#22304a;font-size:16px}.papelesia-identidad small{display:block;color:#6f7b90;font-size:12px;margin-top:1px}.papelesia-cerrar{background:transparent!important;color:#6f7b90!important;box-shadow:none!important;padding:6px!important;font-size:22px!important;line-height:1!important}
    #papelesia-mensajes{flex:1;overflow:auto;padding:16px;background:#fffdfb;display:flex;flex-direction:column;gap:11px}
    .papelesia-msg{max-width:84%;padding:11px 13px;border-radius:15px;font-size:14px;line-height:1.5;white-space:pre-wrap}.papelesia-msg.bot{align-self:flex-start;background:#f1f3ff;color:#33405a;border-bottom-left-radius:5px}.papelesia-msg.user{align-self:flex-end;background:#6f7cf7;color:#fff;border-bottom-right-radius:5px}.papelesia-msg.estado{opacity:.7;font-style:italic}
    .papelesia-form{padding:12px;border-top:1px solid #eee7e2;background:#fff;display:flex;gap:8px}.papelesia-form textarea{flex:1;resize:none;min-height:44px;max-height:110px;border:1px solid #d9d2cc;border-radius:12px;padding:11px 12px;font:inherit;font-size:14px;outline:none}.papelesia-form textarea:focus{border-color:#6f7cf7;box-shadow:0 0 0 3px rgba(111,124,247,.1)}.papelesia-form button{padding:10px 14px!important;border-radius:12px!important;font-size:14px!important}.papelesia-nota{padding:0 14px 12px;background:#fff;color:#8a93a4;font-size:10.5px;line-height:1.35}
    @media(max-width:600px){#papelesia-launcher{right:14px;bottom:14px}#papelesia-panel{right:14px;bottom:72px;width:calc(100vw - 28px);height:calc(100vh - 96px)}}
  `;
  document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.id = 'papelesia-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Abrir PapelesIA');
  launcher.innerHTML = '<span>👶✨</span><span>PapelesIA</span>';

  const panel = document.createElement('section');
  panel.id = 'papelesia-panel';
  panel.setAttribute('aria-label', 'Chat PapelesIA');
  panel.innerHTML = `
    <div class="papelesia-head">
      <div class="papelesia-identidad">
        <div class="papelesia-avatar">👶</div>
        <div><strong>PapelesIA</strong><small>Asistente de ayudas y trámites</small></div>
      </div>
      <button class="papelesia-cerrar" type="button" aria-label="Cerrar">×</button>
    </div>
    <div id="papelesia-mensajes"></div>
    <form class="papelesia-form">
      <textarea maxlength="600" rows="1" placeholder="Pregúntame sobre ayudas o trámites..." aria-label="Escribe tu pregunta"></textarea>
      <button type="submit">Enviar</button>
    </form>
    <div class="papelesia-nota">PapelesIA orienta, pero no sustituye a la Administración. Verifica siempre requisitos y plazos en la fuente oficial.</div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  const mensajesEl = panel.querySelector('#papelesia-mensajes');
  const form = panel.querySelector('.papelesia-form');
  const textarea = form.querySelector('textarea');
  const cerrar = panel.querySelector('.papelesia-cerrar');
  const historial = [];

  function addMsg(texto, tipo, extra='') {
    const el = document.createElement('div');
    el.className = `papelesia-msg ${tipo} ${extra}`.trim();
    el.textContent = texto;
    mensajesEl.appendChild(el);
    mensajesEl.scrollTop = mensajesEl.scrollHeight;
    return el;
  }

  addMsg('¡Hola! Soy PapelesIA 👋\nPuedo ayudarte a orientarte con ayudas y trámites después de tener un bebé en España. ¿Qué necesitas saber?', 'bot');

  launcher.addEventListener('click', () => {
    panel.classList.toggle('abierto');
    if (panel.classList.contains('abierto')) setTimeout(() => textarea.focus(), 50);
  });
  cerrar.addEventListener('click', () => panel.classList.remove('abierto'));

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = textarea.value.trim();
    if (!texto) return;

    textarea.value = '';
    addMsg(texto, 'user');
    historial.push({ role: 'user', content: texto });
    if (historial.length > 8) historial.splice(0, historial.length - 8);

    const esperando = addMsg('PapelesIA está pensando…', 'bot', 'estado');
    form.querySelector('button').disabled = true;

    try {
      const r = await fetch('/api/papelesia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historial })
      });
      const data = await r.json();
      esperando.remove();
      if (!r.ok) throw new Error(data.error || 'No se ha podido responder.');
      const respuesta = data.reply || 'No he podido generar una respuesta.';
      addMsg(respuesta, 'bot');
      historial.push({ role: 'assistant', content: respuesta });
      if (historial.length > 8) historial.splice(0, historial.length - 8);
    } catch (err) {
      esperando.remove();
      addMsg(err.message || 'Ahora mismo no puedo responder. Inténtalo de nuevo en unos minutos.', 'bot');
    } finally {
      form.querySelector('button').disabled = false;
      textarea.focus();
    }
  });
})();