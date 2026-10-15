(() => {
  const MASTER_KEY = 'papelesbebe_que_me_falta_v1';
  const APP_COMPLETED_KEY = 'tramitesFacilesCompletados';
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

  function normalizarCabecera() {
    const header = document.querySelector('header');
    if (!header) return;
    let container = header.querySelector('.header-contenido');
    if (!container) {
      container = document.createElement('div');
      container.className = 'header-contenido';
      while (header.firstChild) container.appendChild(header.firstChild);
      header.appendChild(container);
    }

    let logo = container.querySelector('.logo-enlace, a.logo');
    if (!logo) {
      logo = document.createElement('a');
      logo.href = '/';
      logo.className = 'logo logo-enlace';
      logo.setAttribute('aria-label', 'Ir al inicio');
      logo.innerHTML = 'Papeles del <span>Bebé</span>';
    }

    Array.from(container.children).forEach((child) => {
      if (child !== logo) child.remove();
    });
    if (!logo.parentNode) container.appendChild(logo);

    const nav = document.createElement('nav');
    nav.className = 'nav-principal';
    nav.setAttribute('aria-label', 'Navegación principal');
    const path = location.pathname;
    NAV_ITEMS.forEach(([href, text]) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      if (href === '/premium/') a.className = 'nav-premium';
      const active = href === '/mi-panel/' ? path.startsWith('/mi-panel/') : path.startsWith(href);
      if (active) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    container.appendChild(nav);
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
