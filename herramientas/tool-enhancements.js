(() => {
  const path = window.location.pathname;
  const eligible = path.startsWith('/herramientas/') || path === '/mi-panel/' || path.startsWith('/checklist/');
  if (!eligible) return;

  const CONTEXT_KEY = 'papelesbebe_shared_context_v1';
  const PROGRESS_KEY = 'papelesbebe_que_me_falta_v1';

  const configs = {
    '/mi-panel/': {
      title: 'Qué hacer ahora',
      actions: [
        ['Revisa tu primer bloque pendiente', '#panelTasks'],
        ['Prepara la documentación del siguiente trámite', '/documentos-tramites-bebe/'],
        ['Consulta oportunidades verificadas', '/observatorio/']
      ],
      ai: true
    },
    '/herramientas/que-me-falta/': {
      title: 'Convierte la lista en acciones',
      actions: [
        ['Empieza por el primer bloque pendiente', '#results'],
        ['Comprueba qué documentos preparar', '/documentos-tramites-bebe/'],
        ['Abre tu panel para seguir el progreso', '/mi-panel/']
      ],
      ai: true
    },
    '/herramientas/buscador-ayudas/': {
      title: 'Después del resultado',
      actions: [
        ['Abre la guía de cada ayuda que quieras revisar', '#resultados'],
        ['Comprueba documentación y requisitos en la fuente oficial', '/documentos-tramites-bebe/'],
        ['Guarda el siguiente paso en tu panel', '/mi-panel/']
      ],
      ai: true
    },
    '/herramientas/calculadora-permiso-nacimiento/': {
      title: 'Después del cálculo',
      actions: [
        ['Contrasta el resultado con Seguridad Social', '/permiso-nacimiento-cuidado-menor-2026/'],
        ['Prepara la documentación habitual', '/documentacion-prestacion-nacimiento/'],
        ['Añádelo a tu progreso', '/mi-panel/']
      ],
      ai: true
    },
    '/herramientas/calendario-primeros-90-dias/': {
      title: 'Convierte el calendario en tareas',
      actions: [
        ['Consulta qué te queda pendiente', '/herramientas/que-me-falta/'],
        ['Prepara documentos por trámite', '/documentos-tramites-bebe/'],
        ['Sigue el avance desde tu panel', '/mi-panel/']
      ],
      ai: true
    }
  };

  function read(storage, key) {
    try { return JSON.parse(storage.getItem(key) || '{}') || {}; } catch (_) { return {}; }
  }

  function safeText(value) {
    return String(value || '').replace(/[<>]/g, '');
  }

  function buildContextPrompt() {
    const c = read(sessionStorage, CONTEXT_KEY);
    const p = read(localStorage, PROGRESS_KEY);
    const pending = Object.keys(p).filter(k => p[k] === false);
    const done = Object.keys(p).filter(k => p[k] === true);
    const parts = [
      'Estoy usando Papeles del Bebé en la página: ' + document.title.replace(/\s*\|.*$/, '') + '.',
      'Explícame de forma práctica qué debería hacer a continuación. No decidas mi elegibilidad ni inventes requisitos, importes o plazos.'
    ];
    if (c.territory) parts.push('Comunidad indicada: ' + safeText(c.territory) + '.');
    if (c.employment) parts.push('Situación laboral indicada: ' + safeText(c.employment) + '.');
    if (c.family) parts.push('Situación familiar indicada: ' + safeText(c.family) + '.');
    if (done.length) parts.push('Bloques ya revisados: ' + done.join(', ') + '.');
    if (pending.length) parts.push('Bloques pendientes: ' + pending.join(', ') + '.');
    parts.push('Prioriza: qué hacer ahora, qué documentación revisar y qué fuente oficial debería comprobar. Sé breve.');
    return parts.join(' ');
  }

  function makeBox() {
    const cfg = configs[path];
    if (!cfg || document.getElementById('pb-action-box')) return;
    const main = document.querySelector('main');
    if (!main) return;

    const box = document.createElement('section');
    box.id = 'pb-action-box';
    box.className = 'tool-panel';
    box.style.marginTop = '18px';
    box.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><div><span class="tool-kicker">SIGUIENTE PASO</span><h2 style="margin:8px 0 5px">' + cfg.title + '</h2></div><span style="font-size:.82rem;color:#666b7b">Orientativo · comprueba siempre la fuente oficial</span></div>' +
      '<div style="display:grid;gap:9px;margin-top:12px">' + cfg.actions.map((a, i) => '<a href="' + a[1] + '" style="display:flex;gap:10px;align-items:center;padding:12px 14px;border:1px solid #e5e7ef;border-radius:14px;text-decoration:none;color:inherit"><strong style="color:#5b61d6">' + (i + 1) + '.</strong><span>' + a[0] + '</span></a>').join('') + '</div>' +
      '<div style="margin-top:14px;padding-top:13px;border-top:1px solid #ececf4;font-size:.86rem;color:#686d7b"><strong>Cómo generamos estas indicaciones:</strong> usamos el resultado y el progreso del navegador para ordenar acciones. Las guías enlazan las fuentes oficiales cuando corresponda. No presentamos una orientación como concesión, resolución ni asesoramiento profesional.</div>';

    if (cfg.ai) {
      const ai = document.createElement('div');
      ai.style.cssText = 'margin-top:16px;padding:16px;border-radius:16px;background:#f7f6ff;border:1px solid #e1ddfb';
      ai.innerHTML = '<h3 style="margin:0 0 6px">✨ Explícame mi situación con PapelesIA</h3><p style="margin:0 0 10px;color:#686d7b">Al pulsar, enviaremos a PapelesIA solo el contexto no sensible de esta sesión y el estado general de tus bloques para darte una explicación. No enviamos la fecha exacta de nacimiento ni datos de discapacidad.</p><button type="button" id="pb-context-ai" class="tool-cta">Explicar mi siguiente paso</button><div id="pb-context-ai-result" aria-live="polite" style="display:none;margin-top:12px;padding:13px;border-radius:13px;background:#fff;white-space:pre-wrap;line-height:1.55"></div>';
      box.appendChild(ai);
    }

    const anchor = document.querySelector('main > footer');
    if (anchor) main.insertBefore(box, anchor); else main.appendChild(box);

    document.getElementById('pb-context-ai')?.addEventListener('click', async function() {
      const btn = this;
      const result = document.getElementById('pb-context-ai-result');
      btn.disabled = true;
      btn.textContent = 'Consultando…';
      result.style.display = 'block';
      result.textContent = 'Preparando una explicación basada en tu contexto…';
      try {
        const response = await fetch('/api/papelesia', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({messages:[{role:'user', content:buildContextPrompt()}]})
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'PapelesIA no está disponible ahora mismo.');
        result.textContent = data.reply || 'PapelesIA no ha podido generar una explicación.';
      } catch (error) {
        result.textContent = error.message || 'PapelesIA no está disponible ahora mismo. Puedes continuar usando las guías y fuentes oficiales.';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Explicar mi siguiente paso';
      }
    });
  }

  function init() {
    makeBox();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
