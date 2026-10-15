(() => {
  const MASTER_KEY = 'papelesbebe_que_me_falta_v1';
  const APP_COMPLETED_KEY = 'tramitesFacilesCompletados';
  const HEADER_VERSION = '20261015-4';
  const NAV_ITEMS = [
    ['/mi-panel/', 'Mi panel'],
    ['/herramientas/', 'Herramientas'],
    ['/guias-familias/', 'Guías'],
    ['/ayudas-nacimiento/', 'Ayudas'],
    ['/tramites-bebe/', 'Trámites'],
    ['/observatorio/', 'Observatorio'],
    ['/premium/', 'Premium']
  ];

  function readLocal(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  }

  function writeLocal(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function readMaster() {
    const state = readLocal(MASTER_KEY, {});
    return state && typeof state === 'object' ? state : {};
  }

  function writeMaster(state) {
    writeLocal(MASTER_KEY, state);
    window.dispatchEvent(new CustomEvent('papelesbebe:progress', { detail: state }));
  }

  function masterKeyForAppId(id) {
    if (id === 'registro-civil') return 'registro';
    if (id === 'seguridad-social-bebe') return 'seguridad-social';
    if (id === 'tsi-cataluna' || id === 'tarjeta-sanitaria-autonomica') return 'tarjeta-sanitaria';
    if (id === 'empadronamiento') return 'padron';
    if (id === 'prestacion-nacimiento' || id === 'situacion-desempleo') return 'prestacion';
    if (id === 'deduccion-maternidad') return 'deduccion';
    if (/^(ayuda|ayudas|pago-unico)/.test(id || '')) return 'ayudas';
    return '';
  }

  function masterKeyForPremiumId(id) {
    return {
      registro: 'registro',
      ss: 'seguridad-social',
      salud: 'tarjeta-sanitaria',
      padron: 'padron',
      prestacion: 'prestacion',
      maternidad: 'deduccion',
      ccaa: 'ayudas',
      mono: 'ayudas',
      multiple: 'ayudas',
      discapacidad: 'ayudas'
    }[id] || '';
  }

  function migrateLegacyProgress() {
    let master = readMaster();
    const hasMaster = Object.keys(master).length > 0;
    const completed = readLocal(APP_COMPLETED_KEY, []);
    if (!hasMaster && Array.isArray(completed) && completed.length) {
      master = {};
      completed.forEach((id) => {
        const key = masterKeyForAppId(id);
        if (key) master[key] = true;
      });
      if (Object.keys(master).length) writeMaster(master);
    }
  }

  function asegurarEstilosCabecera() {
    if (document.getElementById('pb-global-header-style')) return;
    const style = document.createElement('style');
    style.id = 'pb-global-header-style';
    style.textContent = `
      header.pb-global-header{background:#fff!important;border-bottom:1px solid #e7e8ef!important;box-shadow:0 1px 0 rgba(24,31,54,.02)!important;position:relative!important;z-index:1000!important}
      header.pb-global-header .header-contenido{max-width:1280px!important;margin:0 auto!important;min-height:74px!important;padding:10px 24px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:24px!important;box-sizing:border-box!important}
      header.pb-global-header .logo-enlace{flex:0 0 auto!important;text-decoration:none!important}
      header.pb-global-header .nav-principal{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:6px!important;flex-wrap:wrap!important;margin:0!important;padding:0!important}
      header.pb-global-header .nav-principal a{display:inline-flex!important;align-items:center!important;min-height:42px!important;padding:9px 11px!important;border-radius:12px!important;border:1px solid transparent!important;background:transparent!important;color:#586176!important;text-decoration:none!important;font-weight:750!important;font-size:.94rem!important;line-height:1.2!important;white-space:nowrap!important;box-shadow:none!important}
      header.pb-global-header .nav-principal a:hover{background:#f6f7ff!important;color:#454bc0!important}
      header.pb-global-header .nav-principal a[aria-current="page"]{background:#f0efff!important;color:#555bd1!important;border-color:#dcddff!important}
      header.pb-global-header .nav-principal a.nav-premium{background:#f3efff!important;color:#6751cf!important;border-color:#dfd5ff!important}
      header.pb-global-header .header-acciones,header.pb-global-header .boton-inicio,header.pb-global-header .enlace-inicio,header.pb-global-header .header-badge,header.pb-global-header .header-tag,header.pb-global-header .guia-independiente{display:none!important}
      @media(max-width:900px){header.pb-global-header .header-contenido{align-items:flex-start!important;flex-direction:column!important;gap:8px!important;padding:10px 16px!important}header.pb-global-header .nav-principal{width:100%!important;justify-content:flex-start!important;overflow-x:auto!important;flex-wrap:nowrap!important;padding-bottom:2px!important}header.pb-global-header .nav-principal a{font-size:.88rem!important;padding:8px 10px!important}}
    `;
    document.head.appendChild(style);
  }

  function navHtml() {
    const path = location.pathname;
    return NAV_ITEMS.map(([href, text]) => {
      const active = href === '/mi-panel/' ? path.startsWith('/mi-panel/') : path.startsWith(href);
      const classes = href === '/premium/' ? ' class="nav-premium"' : '';
      const current = active ? ' aria-current="page"' : '';
      return `<a href="${href}"${classes}${current}>${text}</a>`;
    }).join('');
  }

  function normalizarCabecera() {
    asegurarEstilosCabecera();
    let header = document.querySelector('body > header, header');
    if (!header) {
      header = document.createElement('header');
      document.body.insertBefore(header, document.body.firstChild);
    }

    const expectedPath = location.pathname;
    const alreadyCurrent = header.dataset.pbHeaderVersion === HEADER_VERSION && header.dataset.pbHeaderPath === expectedPath;
    if (alreadyCurrent) return;

    header.className = 'pb-global-header';
    header.dataset.pbHeaderVersion = HEADER_VERSION;
    header.dataset.pbHeaderPath = expectedPath;
    header.innerHTML = `
      <div class="header-contenido">
        <a href="/" class="logo logo-enlace" aria-label="Ir al inicio">Papeles del <span>Bebé</span></a>
        <nav class="nav-principal" aria-label="Navegación principal">${navHtml()}</nav>
      </div>`;
  }

  function syncAppChecklist() {
    const boxes = Array.from(document.querySelectorAll('.checkTramite[data-id]'));
    if (!boxes.length) return;
    const master = readMaster();
    let completed = readLocal(APP_COMPLETED_KEY, []);
    if (!Array.isArray(completed)) completed = [];
    const completedSet = new Set(completed);

    boxes.forEach((box) => {
      const id = box.dataset.id;
      const key = masterKeyForAppId(id);
      if (!key) return;
      if (typeof master[key] === 'boolean') {
        box.checked = master[key];
        if (master[key]) completedSet.add(id);
        else completedSet.delete(id);
      }
      if (!box.dataset.pbMasterBound) {
        box.dataset.pbMasterBound = '1';
        box.addEventListener('change', () => {
          const next = readMaster();
          next[key] = box.checked;
          writeMaster(next);
        });
      }
      if (typeof window.actualizarAspectoTramite === 'function') {
        try { window.actualizarAspectoTramite(box); } catch (_) {}
      }
    });
    writeLocal(APP_COMPLETED_KEY, Array.from(completedSet));
    if (typeof window.actualizarContador === 'function') {
      try { window.actualizarContador(); } catch (_) {}
    }
  }

  function syncPrintableChecklist() {
    if (!location.pathname.startsWith('/checklist-imprimible/')) return;
    const boxes = Array.from(document.querySelectorAll('section[aria-label="Lista de trámites"] input[type="checkbox"]'));
    if (!boxes.length) return;
    const keys = ['registro','registro','seguridad-social','tarjeta-sanitaria','padron','prestacion','ayudas','deduccion'];
    const master = readMaster();
    boxes.forEach((box, index) => {
      const key = keys[index];
      if (!key) return;
      if (typeof master[key] === 'boolean') box.checked = master[key];
      if (!box.dataset.pbMasterBound) {
        box.dataset.pbMasterBound = '1';
        box.addEventListener('change', () => {
          const next = readMaster();
          next[key] = box.checked;
          writeMaster(next);
        });
      }
    });
  }

  function syncSimpleProgress() {
    document.querySelectorAll('input[type="checkbox"][data-key]').forEach((box) => {
      const key = box.dataset.key;
      if (!['registro','seguridad-social','tarjeta-sanitaria','padron','prestacion','deduccion','ayudas'].includes(key)) return;
      const master = readMaster();
      if (typeof master[key] === 'boolean' && box.checked !== master[key]) box.checked = master[key];
    });
  }

  function syncPremiumDom() {
    const selects = Array.from(document.querySelectorAll('select[data-task-status]'));
    if (!selects.length) return;
    const master = readMaster();
    selects.forEach((select) => {
      const key = masterKeyForPremiumId(select.dataset.taskStatus);
      if (!key) return;
      if (typeof master[key] === 'boolean') {
        const desired = master[key] ? 'done' : 'pending';
        if (select.value !== desired) select.value = desired;
      }
      if (!select.dataset.pbMasterBound) {
        select.dataset.pbMasterBound = '1';
        select.addEventListener('change', () => {
          const next = readMaster();
          next[key] = select.value === 'done' || select.value === 'na';
          writeMaster(next);
        });
      }
    });
  }

  function actualizarPremiumGratis() {
    const home = document.querySelector('.home-premium-destacado');
    if (home) {
      const etiqueta = home.querySelector('.contenido-etiqueta');
      const texto = home.querySelector('.home-papelesia-copy p');
      const cta = home.querySelector('a[href="/premium/"]');
      if (etiqueta) etiqueta.textContent = 'PLAN PREMIUM · GRATIS TEMPORALMENTE';
      if (texto) texto.textContent = 'Fechas, prioridades, documentos y ayudas reunidos en un plan personalizado. Gratis temporalmente y sin tarjeta.';
      if (cta) cta.textContent = 'Abrir Premium gratis →';
    }
  }

  function aplicar() {
    normalizarCabecera();
    syncAppChecklist();
    syncPrintableChecklist();
    syncSimpleProgress();
    syncPremiumDom();
    actualizarPremiumGratis();
  }

  migrateLegacyProgress();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  else aplicar();

  window.addEventListener('storage', aplicar);
  window.addEventListener('papelesbebe:progress', aplicar);

  let pendiente = false;
  const iniciarObserver = () => {
    if (!document.body) return;
    const observer = new MutationObserver(() => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        aplicar();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarObserver, { once: true });
  else iniciarObserver();
})();
