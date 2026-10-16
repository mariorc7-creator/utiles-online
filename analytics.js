(() => {
  if (!window.__papelesBebeGlobalUiLoaded) {
    window.__papelesBebeGlobalUiLoaded = true;
    const ui = document.createElement('script');
    ui.src = '/global-ui.js?v=20261015-8';
    ui.defer = true;
    document.head.appendChild(ui);
  }

  if (!window.__papelesBebeSharedContextLoaded) {
    window.__papelesBebeSharedContextLoaded = true;
    const sharedContext = document.createElement('script');
    sharedContext.src = '/herramientas/shared-context.js?v=20261015-1';
    sharedContext.defer = true;
    document.head.appendChild(sharedContext);
  }

  if (!window.__papelesBebeToolEnhancementsLoaded) {
    window.__papelesBebeToolEnhancementsLoaded = true;
    const toolEnhancements = document.createElement('script');
    toolEnhancements.src = '/herramientas/tool-enhancements.js?v=20261015-1';
    toolEnhancements.defer = true;
    document.head.appendChild(toolEnhancements);
  }

  if (!window.__papelesBebePersistentStateLoaded) {
    window.__papelesBebePersistentStateLoaded = true;
    const persistentState = document.createElement('script');
    persistentState.src = '/herramientas/persistent-state.js?v=20261016-1';
    persistentState.defer = true;
    document.head.appendChild(persistentState);
  }

  if (!window.__papelesBebeUxFocusLoaded) {
    window.__papelesBebeUxFocusLoaded = true;
    const uxFocus = document.createElement('script');
    uxFocus.src = '/ux-focus.js?v=20261016-1';
    uxFocus.defer = true;
    document.head.appendChild(uxFocus);
  }

  if (!window.__papelesBebeUxHotfixLoaded) {
    window.__papelesBebeUxHotfixLoaded = true;
    const uxHotfix = document.createElement('script');
    uxHotfix.src = '/ux-hotfix.js?v=20261016-1';
    uxHotfix.defer = true;
    document.head.appendChild(uxHotfix);
  }

  if (window.location.pathname.startsWith('/api/preparar-tarjeta-sanitaria')) {
    const resultActions = document.createElement('script');
    resultActions.src = '/preparador-tarjeta-sanitaria/resultado-actions.js?v=20261016-1';
    resultActions.defer = true;
    document.head.appendChild(resultActions);
  }

  if (window.location.pathname === '/herramientas/que-me-falta/' || window.location.pathname === '/herramientas/que-me-falta') {
    const valueV2 = document.createElement('script');
    valueV2.src = '/herramientas/que-me-falta/value-v2.js?v=20261016-4';
    valueV2.defer = true;
    document.head.appendChild(valueV2);
  }

  if (window.location.pathname === '/mi-panel/' || window.location.pathname === '/mi-panel') {
    const panelValueV2 = document.createElement('script');
    panelValueV2.src = '/mi-panel/value-v2.js?v=20261016-4';
    panelValueV2.defer = true;
    document.head.appendChild(panelValueV2);

    const carpeta = document.createElement('script');
    carpeta.src = '/mi-panel/carpeta-bebe.js?v=20261016-1';
    carpeta.defer = true;
    document.head.appendChild(carpeta);

    const radar = document.createElement('script');
    radar.src = '/mi-panel/radar-oportunidades.js?v=20261016-1';
    radar.defer = true;
    document.head.appendChild(radar);
  }

  if (window.location.pathname === '/herramientas/buscador-ayudas/' || window.location.pathname === '/herramientas/buscador-ayudas') {
    const aidValueV2 = document.createElement('script');
    aidValueV2.src = '/herramientas/buscador-ayudas/value-v2.js?v=20261016-2';
    aidValueV2.defer = true;
    document.head.appendChild(aidValueV2);
  }

  const GA_ID = 'G-YQ7QHVVWZV';
  const STORAGE_KEY = 'papelesbebe_analytics_consent';

  function loadGa4() {
    if (window.__papelesBebeGaLoaded) return;
    window.__papelesBebeGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    const path = window.location.pathname;
    if (path === '/checklist/' || path.startsWith('/checklist/?')) window.gtag('event', 'checklist_start');
    if (path.startsWith('/checklist/completada')) window.gtag('event', 'checklist_completed');
  }

  function removeBanner() { document.getElementById('pb-consent-banner')?.remove(); }
  function saveChoice(value) { try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {} }
  function showBanner() {
    if (document.getElementById('pb-consent-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'pb-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferencias de analítica');
    banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:720px;margin:auto;background:#fff;border:1px solid #ddd;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.18);padding:18px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937';
    banner.innerHTML = `<div style="font-weight:700;font-size:16px;margin-bottom:6px">¿Nos permites medir visitas?</div><div style="font-size:14px;line-height:1.5;margin-bottom:14px">Usamos Google Analytics 4 solo para saber cuántas personas visitan Papeles del Bebé y qué páginas resultan útiles. No cargamos Analytics hasta que aceptes. <a href="/privacidad/" style="color:#4f46e5">Más información</a>.</div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end"><button id="pb-reject-analytics" type="button" style="border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:600">Rechazar</button><button id="pb-accept-analytics" type="button" style="border:0;background:#4f46e5;color:#fff;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:700">Aceptar analítica</button></div>`;
    document.body.appendChild(banner);
    document.getElementById('pb-accept-analytics').addEventListener('click', () => { saveChoice('accepted'); removeBanner(); loadGa4(); });
    document.getElementById('pb-reject-analytics').addEventListener('click', () => { saveChoice('rejected'); removeBanner(); });
  }

  let consent = null;
  try { consent = localStorage.getItem(STORAGE_KEY); } catch (_) {}
  if (consent === 'accepted') loadGa4();
  else if (consent !== 'rejected') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner, { once: true });
    else showBanner();
  }
})();