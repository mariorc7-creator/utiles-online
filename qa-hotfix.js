(() => {
  if (window.__pbQaHotfixLoaded) return;
  window.__pbQaHotfixLoaded = true;

  const WORKSPACE_KEY = 'papelesbebe_workspace_v1';
  const PROGRESS_KEY = 'papelesbebe_que_me_falta_v1';
  const DOCS_KEY = 'papelesbebe_documentos_v1';
  const CONTEXT_KEY = 'papelesbebe_shared_context_v1';
  const LEGACY_KEY = 'tramitesFacilesCompletados';

  function readLocal(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { return {}; }
  }
  function writeLocal(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function addHardeningStyles() {
    if (document.getElementById('pb-qa-hardening-style')) return;
    const style = document.createElement('style');
    style.id = 'pb-qa-hardening-style';
    style.textContent = `
      @media(max-width:700px){
        .pb-mobile-next{bottom:72px!important}
        body:has(.pb-mobile-next){padding-bottom:142px!important}
        #papelesia-launcher{bottom:76px!important;z-index:10020!important}
        body:has(.pb-mobile-next) #papelesia-launcher{bottom:146px!important}
        #papelesia-panel{bottom:70px!important;z-index:10021!important;max-height:calc(100dvh - 86px)!important}
      }
    `;
    document.head.appendChild(style);
  }

  function fixPanelReset() {
    if (location.pathname !== '/mi-panel/' && location.pathname !== '/mi-panel') return;
    const reset = document.getElementById('resetProgress');
    if (!reset || reset.dataset.qaResetFixed === '1') return;
    reset.dataset.qaResetFixed = '1';
    reset.addEventListener('click', () => {
      setTimeout(() => {
        const workspace = readLocal(WORKSPACE_KEY);
        if (workspace.progress) delete workspace.progress;
        workspace.updatedAt = new Date().toISOString();
        writeLocal(WORKSPACE_KEY, workspace);
        const state = readLocal(PROGRESS_KEY);
        Object.keys(state).forEach(k => { state[k] = false; });
        writeLocal(PROGRESS_KEY, state);
      }, 0);
    });
  }

  function hardenStartOverButton() {
    if (location.pathname !== '/' && location.pathname !== '') return;
    const old = document.getElementById('pb-start-over');
    if (!old || old.dataset.qaHardReset === '1') return;
    const button = old.cloneNode(true);
    button.dataset.qaHardReset = '1';
    old.replaceWith(button);
    button.addEventListener('click', () => {
      if (!window.confirm('¿Quieres borrar todo el progreso guardado en este navegador y empezar desde cero?')) return;
      try {
        localStorage.removeItem(WORKSPACE_KEY);
        localStorage.removeItem(PROGRESS_KEY);
        localStorage.removeItem(DOCS_KEY);
        localStorage.removeItem(LEGACY_KEY);
        sessionStorage.removeItem(CONTEXT_KEY);
      } catch (_) {}
      location.reload();
    });
  }

  function fixDynamicHashTarget() {
    if (location.pathname !== '/mi-panel/' && location.pathname !== '/mi-panel') return;
    if (location.hash !== '#mi-carpeta-bebe') return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const target = document.getElementById('mi-carpeta-bebe');
      if (target) {
        clearInterval(timer);
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      } else if (tries >= 30) clearInterval(timer);
    }, 100);
  }

  function restorePanelContextFromWorkspace() {
    if (location.pathname !== '/mi-panel/' && location.pathname !== '/mi-panel') return;
    const profile = document.getElementById('profile');
    if (!profile || profile.querySelector('div')) return;
    const workspace = readLocal(WORKSPACE_KEY);
    const tools = workspace.tools || {};
    const aid = (tools['/herramientas/buscador-ayudas/'] || {}).fields || {};
    const health = (tools['/preparador-tarjeta-sanitaria/'] || {}).fields || {};
    const permit = (tools['/herramientas/calculadora-permiso-nacimiento/'] || {}).fields || {};
    const community = aid.comunidad || health.comunidad || '';
    const family = aid.familia || (permit.tipo === 'mono' ? 'monoparental' : permit.tipo === 'general' ? 'general' : '');
    const employment = aid.laboral || '';
    const birthDate = permit.fecha || aid.fecha || '';
    const communityLabels = {andalucia:'Andalucía',aragon:'Aragón',asturias:'Asturias',baleares:'Illes Balears',canarias:'Canarias',cantabria:'Cantabria',castillalamancha:'Castilla-La Mancha','castilla-la-mancha':'Castilla-La Mancha',castillayleon:'Castilla y León','castilla-y-leon':'Castilla y León',cataluna:'Cataluña',valencia:'Comunitat Valenciana','comunidad-valenciana':'Comunitat Valenciana',extremadura:'Extremadura',galicia:'Galicia',madrid:'Comunidad de Madrid','comunidad-de-madrid':'Comunidad de Madrid',murcia:'Región de Murcia','region-de-murcia':'Región de Murcia',navarra:'Navarra',paisvasco:'País Vasco','pais-vasco':'País Vasco',larioja:'La Rioja','la-rioja':'La Rioja',ceuta:'Ceuta',melilla:'Melilla'};
    const familyLabels = {general:'General',monoparental:'Monoparental',numerosa:'Familia numerosa'};
    const employmentLabels = {asalariado:'Cuenta ajena',autonomo:'Autónomo/a',desempleado:'Desempleado/a',no_trabajo:'Actualmente no trabaja'};
    const items = [];
    if (community) items.push(['Comunidad', communityLabels[community] || community]);
    if (employment) items.push(['Situación laboral', employmentLabels[employment] || employment]);
    if (family) items.push(['Familia', familyLabels[family] || family]);
    if (birthDate) {
      let shown = birthDate;
      try { shown = new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(birthDate+'T12:00:00')); } catch (_) {}
      items.push(['Fecha usada', shown]);
    }
    if (!items.length) return;
    profile.innerHTML = items.map(([k,v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    const note = profile.closest('.panel-card')?.querySelector('.panel-note');
    if (note) note.textContent = 'Reutilizamos solo respuestas funcionales guardadas en este navegador para que puedas continuar otro día. No mostramos datos personales ni clínicos.';
  }

  function improveHubFormA11y() {
    const select = document.getElementById('selectorComunidadHub');
    if (select && !select.getAttribute('aria-label')) select.setAttribute('aria-label', 'Selecciona tu comunidad o ciudad autónoma');
  }

  function fixHubNavigationState() {
    const path = location.pathname;
    if (path !== '/tramites-bebe/' && path !== '/tramites-bebe') return;
    const nav = document.querySelector('header .nav-principal');
    if (!nav) return;
    nav.querySelectorAll('a[aria-current="page"]').forEach(a => a.removeAttribute('aria-current'));
    const current = nav.querySelector('a[href="/tramites-bebe/"]');
    if (current) current.setAttribute('aria-current', 'page');
  }

  function removeHubProgressNoise() {
    const path = location.pathname;
    if (!['/ayudas-nacimiento/','/ayudas-nacimiento','/tramites-bebe/','/tramites-bebe'].includes(path)) return;
    document.getElementById('pb-article-progress')?.remove();
  }

  function reconcile() {
    hardenStartOverButton();
    fixHubNavigationState();
    removeHubProgressNoise();
    restorePanelContextFromWorkspace();
  }

  function boot() {
    addHardeningStyles();
    fixPanelReset();
    fixDynamicHashTarget();
    improveHubFormA11y();
    reconcile();

    const observer = new MutationObserver(() => reconcile());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 5000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();