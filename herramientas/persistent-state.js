(() => {
  if (window.__pbPersistentStateLoaded) return;
  window.__pbPersistentStateLoaded = true;

  const KEY = 'papelesbebe_workspace_v1';
  const PROGRESS_KEY = 'papelesbebe_que_me_falta_v1';
  const DOCS_KEY = 'papelesbebe_documentos_v1';
  const LEGACY_PROGRESS_KEY = 'tramitesFacilesCompletados';
  const CONTEXT_KEY = 'papelesbebe_shared_context_v1';
  // No guardamos condiciones médicas o circunstancias especiales del nacimiento.
  const PRIVATE_FIELDS = new Set(['multiple','discapacidad','hospitalizacion','situacion']);
  const ALLOWED = new Set([
    'tipo','fecha','objetivo',
    'comunidad','laboral','familia','cobertura','registro','inss','padron','digital','canal','urgente',
    'nacimiento_fuera','cambio_ccaa','doc_extranjera','municipio'
  ]);
  const TOOL_LABELS = {
    '/herramientas/calculadora-permiso-nacimiento/': 'Planificador del permiso',
    '/herramientas/buscador-ayudas/': 'Simulador de ayudas',
    '/preparador-tarjeta-sanitaria/': 'Preparador de Tarjeta Sanitaria',
    '/pack-empadronamiento/': 'Preparador de Empadronamiento',
    '/herramientas/calendario-primeros-90-dias/': 'Calendario de 90 días',
    '/herramientas/que-me-falta/': 'Mi ruta de trámites',
    '/mi-panel/': 'Mi panel'
  };

  const canonicalPath = (path) => {
    if (path.startsWith('/api/calcular-permiso')) return '/herramientas/calculadora-permiso-nacimiento/';
    if (path.startsWith('/api/preparar-tarjeta-sanitaria')) return '/preparador-tarjeta-sanitaria/';
    if (path.length > 1 && !path.endsWith('/')) return path + '/';
    return path;
  };

  let journeyCleared = false;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
      // Saneamos también estados de versiones anteriores sin perder progreso general.
      if (value.tools) Object.values(value.tools).forEach(tool => {
        if (tool && tool.fields) PRIVATE_FIELDS.forEach(k => delete tool.fields[k]);
      });
      return value;
    } catch (_) { return {}; }
  }
  function write(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  }
  function now() { return new Date().toISOString(); }
  function formatDate(iso) {
    if (!iso) return '';
    try { return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(iso)); } catch (_) { return ''; }
  }

  function collectAllowedFields(root=document) {
    const data = {};
    root.querySelectorAll('input,select').forEach(el => {
      const key = el.name || el.id;
      if (!ALLOWED.has(key)) return;
      if (el.type === 'radio') {
        if (el.checked) data[key] = el.value;
      } else if (el.type === 'checkbox') {
        data[key] = !!el.checked;
      } else if (el.value !== '') {
        data[key] = el.value;
      }
    });
    return data;
  }

  function restoreAllowedFields(toolState) {
    if (!toolState || !toolState.fields) return;
    Object.entries(toolState.fields).forEach(([key,value]) => {
      if (!ALLOWED.has(key)) return;
      const nodes = [...document.querySelectorAll(`[name="${CSS.escape(key)}"],#${CSS.escape(key)}`)];
      nodes.forEach(el => {
        if (el.type === 'checkbox') {
          el.checked = !!value;
        } else if (el.type === 'radio') {
          el.checked = String(el.value) === String(value);
        } else if (value != null) {
          const next = String(value);
          if (el.tagName === 'SELECT') {
            const exists = [...el.options].some(o => o.value === next);
            if (exists) el.value = next;
          } else {
            el.value = next;
          }
        }
      });
    });
  }

  function syncLegacyProgress(state) {
    try {
      const p = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') || {};
      if (Object.keys(p).length) state.progress = p;
      else if (state.progress) delete state.progress;
    } catch (_) {}
  }

  function clearJourney() {
    journeyCleared = true;
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(DOCS_KEY);
      localStorage.removeItem(LEGACY_PROGRESS_KEY);
      sessionStorage.removeItem(CONTEXT_KEY);
    } catch (_) {}
  }

  function saveCurrent(reason='change') {
    if (journeyCleared) return;
    const path = canonicalPath(location.pathname);
    const label = TOOL_LABELS[path];
    if (!label) return;
    const state = read();
    state.version = 1;
    state.updatedAt = now();
    // Consultar Mi panel no debe sobrescribir la última herramienta útil.
    if (path !== '/mi-panel/' && path !== '/herramientas/que-me-falta/') {
      state.last = { path, label, updatedAt: state.updatedAt, reason };
    }
    state.tools = state.tools || {};
    const previous = state.tools[path] || {};
    state.tools[path] = {
      ...previous,
      fields: { ...(previous.fields || {}), ...collectAllowedFields() },
      updatedAt: state.updatedAt
    };
    syncLegacyProgress(state);
    write(state);
  }

  function captureQueryResult() {
    const path = location.pathname;
    if (!path.startsWith('/api/calcular-permiso')) return;
    const params = new URLSearchParams(location.search);
    const state = read();
    const toolPath = '/herramientas/calculadora-permiso-nacimiento/';
    state.tools = state.tools || {};
    const fields = {};
    ALLOWED.forEach(k => {
      if (!params.has(k)) return;
      if (['multiple','discapacidad','hospitalizacion'].includes(k)) fields[k] = ['1','true','on'].includes(params.get(k));
      else fields[k] = params.get(k);
    });
    state.tools[toolPath] = { ...(state.tools[toolPath] || {}), fields, updatedAt: now(), hasResult: true };
    state.last = { path: toolPath, label: 'Planificador del permiso', updatedAt: now(), reason: 'result' };
    state.updatedAt = state.last.updatedAt;
    syncLegacyProgress(state);
    write(state);
  }

  function addAutosaveNotice() {
    const path = canonicalPath(location.pathname);
    if (!TOOL_LABELS[path] || path === '/mi-panel/' || path === '/herramientas/que-me-falta/') return;
    const form = document.querySelector('form');
    if (!form || document.querySelector('.pb-autosave-note')) return;
    const note = document.createElement('div');
    note.className = 'pb-autosave-note';
    note.innerHTML = '<span aria-hidden="true">✓</span><div><strong>Puedes continuar mañana</strong><small>Guardamos en este navegador las opciones administrativas básicas. Los datos de circunstancias especiales no se conservan. Al generar un resultado, las respuestas del formulario se envían para calcularlo.</small></div>';
    note.style.cssText = 'display:flex;gap:10px;align-items:flex-start;margin:12px 0 4px;padding:11px 13px;border:1px solid #cfe7d8;background:#f7fcf9;border-radius:13px;color:#25563a';
    note.querySelector('small').style.cssText='display:block;margin-top:2px;color:#5d6f64;line-height:1.4';
    form.appendChild(note);
  }

  function addResumeCard() {
    const path = canonicalPath(location.pathname);
    if (!['/','/herramientas/','/mi-panel/'].includes(path)) return;
    // En portada, el hero de regreso ya ofrece continuar y reiniciar.
    if (path === '/' && document.body.classList.contains('pb-returning')) return;
    const state = read();
    if (!state.last || !state.last.path || state.last.path === '/mi-panel/') return;
    if (document.getElementById('pb-resume-card')) return;
    const target = state.last.path;
    if (!TOOL_LABELS[target] || target === '/mi-panel/') return;
    const label = state.last.label || 'tu proceso';
    const card = document.createElement('section');
    card.id = 'pb-resume-card';
    card.setAttribute('aria-label','Continuar progreso guardado');
    card.style.cssText='max-width:1080px;margin:16px auto 22px;padding:16px 18px;border:1px solid #d9ddfb;border-radius:18px;background:linear-gradient(135deg,#f7f8ff,#fff);box-shadow:0 8px 28px rgba(48,52,100,.05);box-sizing:border-box';
    card.innerHTML = `<div style="display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><span style="font-size:.72rem;font-weight:900;letter-spacing:.06em;color:#5960cf">CONTINUAR DONDE LO DEJASTE</span><strong style="display:block;font-size:1.1rem;margin:4px 0">${label}</strong><small style="color:#6c7080">Guardado en este navegador${state.last.updatedAt ? ' · '+formatDate(state.last.updatedAt) : ''}</small></div><div style="display:flex;gap:8px;flex-wrap:wrap"><a href="${target}" style="display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:11px;background:#6067e8;color:#fff;text-decoration:none;font-weight:850">Continuar →</a><button type="button" id="pb-clear-workspace" style="padding:10px 13px;border-radius:11px;border:1px solid #d5d8e8;background:#fff;color:#626779;font-weight:750;cursor:pointer">Borrar progreso</button></div></div>`;
    const hero = document.querySelector('.tools-hero,.panel-hero,main section');
    if (hero && hero.parentNode) hero.insertAdjacentElement('afterend', card);
    else document.querySelector('main')?.prepend(card);
    card.querySelector('#pb-clear-workspace')?.addEventListener('click', () => {
      if (!window.confirm('¿Quieres borrar el progreso, respuestas y documentos guardados en este navegador?')) return;
      clearJourney();
      card.remove();
      location.reload();
    });
  }

  function boot() {
    captureQueryResult();
    const path = canonicalPath(location.pathname);
    const state = read();
    if (TOOL_LABELS[path] && state.tools && state.tools[path]) restoreAllowedFields(state.tools[path]);

    // Limpieza progresiva de versiones previas que conservaron opciones sensibles.
    if (state.tools) write(state);
    document.addEventListener('change', (e) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLSelectElement)) return;
      const key = el.name || el.id;
      if (ALLOWED.has(key) || el.matches('[data-key]')) saveCurrent('change');
    }, true);
    document.addEventListener('submit', () => saveCurrent('submit'), true);
    window.addEventListener('pagehide', () => { if (!journeyCleared) saveCurrent('leave'); });

    setTimeout(() => {
      addAutosaveNotice();
      addResumeCard();
      if (TOOL_LABELS[path]) saveCurrent('visit');
    }, 0);

    window.PapelesBebeWorkspace = { read, save: saveCurrent, clear: clearJourney };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();