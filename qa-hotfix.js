(() => {
  if (window.__pbQaHotfixLoaded) return;
  window.__pbQaHotfixLoaded = true;

  const WORKSPACE_KEY = 'papelesbebe_workspace_v1';
  const PROGRESS_KEY = 'papelesbebe_que_me_falta_v1';

  function readLocal(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { return {}; }
  }
  function writeLocal(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
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
        try {
          const state = readLocal(PROGRESS_KEY);
          Object.keys(state).forEach(k => { state[k] = false; });
          writeLocal(PROGRESS_KEY, state);
        } catch (_) {}
      }, 0);
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
      } else if (tries >= 20) clearInterval(timer);
    }, 100);
  }

  function improveHubFormA11y() {
    const select = document.getElementById('selectorComunidadHub');
    if (select && !select.getAttribute('aria-label')) select.setAttribute('aria-label', 'Selecciona tu comunidad o ciudad autónoma');
  }

  function boot() {
    fixPanelReset();
    fixDynamicHashTarget();
    improveHubFormA11y();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
