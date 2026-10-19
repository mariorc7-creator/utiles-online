(() => {
  const MASTER_KEY = 'papelesbebe_que_me_falta_v1';
  const APP_COMPLETED_KEY = 'tramitesFacilesCompletados';
  const HEADER_VERSION = '20261019-10';
  const FOOTER_VERSION = '20261015-1';
  const MASTER_KEYS = ['registro','seguridad-social','tarjeta-sanitaria','padron','prestacion','deduccion','ayudas'];
  const NAV_ITEMS = [
    ['/mi-panel/', 'Mi panel'],
    ['/herramientas/', 'Herramientas'],
    ['/guias-familias/', 'Guías'],
    ['/ayudas-nacimiento/', 'Ayudas'],
    ['/tramites-bebe/', 'Trámites'],
    ['/observatorio/', 'Observatorio'],
    ['/preparativos-bebe/', '🧸 Preparativos']
  ];

  function readLocal(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (_) { return fallback; }
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
  function progressCount() {
    const master = readMaster();
    return MASTER_KEYS.filter((key) => master[key] === true).length;
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

  function migrateLegacyProgress() {
    let master = readMaster();
    const completed = readLocal(APP_COMPLETED_KEY, []);
    if (!Object.keys(master).length && Array.isArray(completed) && completed.length) {
      master = {};
      completed.forEach((id) => {
        const key = masterKeyForAppId(id);
        if (key) master[key] = true;
      });
      if (Object.keys(master).length) writeMaster(master);
    }
  }

  function activeSection(href) {
    const p = location.pathname;
    if (href === '/mi-panel/') return p.startsWith('/mi-panel/');
    if (href === '/herramientas/') return p.startsWith('/herramientas/');
    if (href === '/observatorio/') return p.startsWith('/observatorio/');
    if (href === '/preparativos-bebe/') return p.startsWith('/preparativos-bebe/');
    if (href === '/ayudas-nacimiento/') return p.startsWith('/ayuda') || p.startsWith('/familias-') || p.startsWith('/bono-') || p.startsWith('/tarxeta-') || p.startsWith('/deduccion-nacimiento-');
    if (href === '/tramites-bebe/') return /(registro|seguridad-social|tarjeta-sanitaria|empadron|certificado|dni-bebe|pasaporte-bebe)/.test(p);
    if (href === '/guias-familias/') return p.startsWith('/guias-') || p.startsWith('/permiso-') || p.startsWith('/deduccion-maternidad');
    return p.startsWith(href);
  }

  function asegurarEstilosGlobales() {
    if (document.getElementById('pb-global-ui-style')) return;
    const style = document.createElement('style');
    style.id = 'pb-global-ui-style';
    style.textContent = `
      header.pb-global-header{background:#fff!important;border-bottom:1px solid #e7e8ef!important;box-shadow:0 1px 0 rgba(24,31,54,.02)!important;position:relative!important;z-index:1000!important}
      header.pb-global-header .header-contenido{max-width:1280px!important;margin:0 auto!important;min-height:74px!important;padding:10px 24px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:24px!important;box-sizing:border-box!important}
      header.pb-global-header .logo-enlace{flex:0 0 auto!important;text-decoration:none!important}
      header.pb-global-header .nav-principal{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:6px!important;flex-wrap:wrap!important;margin:0!important;padding:0!important}
      header.pb-global-header .nav-principal a{display:inline-flex!important;align-items:center!important;gap:6px!important;min-height:42px!important;padding:9px 11px!important;border-radius:12px!important;border:1px solid transparent!important;background:transparent!important;color:#586176!important;text-decoration:none!important;font-weight:750!important;font-size:.94rem!important;line-height:1.2!important;white-space:nowrap!important;box-shadow:none!important}
      header.pb-global-header .nav-principal a:hover{background:#f6f7ff!important;color:#454bc0!important}
      header.pb-global-header .nav-principal a[aria-current="page"]{background:#f0efff!important;color:#555bd1!important;border-color:#dcddff!important}
      .pb-progress-badge{display:inline-flex;align-items:center;justify-content:center;min-width:34px;padding:2px 7px;border-radius:999px;background:#eef9f2;color:#23724c;font-size:.75rem;font-weight:800;border:1px solid #d5ecdf}
      .pb-article-progress{max-width:1120px;margin:14px auto 20px;padding:14px 16px;border:1px solid #e4e6f2;border-radius:16px;background:#fbfbff;display:flex;align-items:center;justify-content:space-between;gap:14px;box-sizing:border-box}
      .pb-article-progress strong{display:block;color:#27334d;margin-bottom:3px}.pb-article-progress p{margin:0;color:#687087;font-size:.92rem}.pb-article-progress-actions{display:flex;gap:8px;flex-wrap:wrap}.pb-article-progress button,.pb-article-progress a{border:1px solid #d9dcf5;border-radius:10px;padding:8px 11px;background:#fff;color:#5057c8;font:inherit;font-weight:750;text-decoration:none;cursor:pointer;white-space:nowrap}.pb-article-progress.is-done{background:#f4fbf7;border-color:#d6ecdf}.pb-article-progress.is-done strong{color:#23724c}
      footer.pb-global-footer{margin-top:48px!important;background:#182035!important;color:#dfe4f0!important;border-top:0!important;padding:0!important}.pb-footer-inner{max-width:1180px;margin:0 auto;padding:34px 24px;display:grid;grid-template-columns:1.1fr 2fr auto;gap:28px;align-items:start;box-sizing:border-box}.pb-footer-brand{font-weight:850;font-size:1.15rem;color:#fff!important;text-decoration:none}.pb-footer-brand span{color:#8f94ff}.pb-global-footer p{color:#b8c0d2!important;margin:8px 0 0!important}.pb-global-footer nav{display:flex;gap:10px 18px;flex-wrap:wrap}.pb-global-footer nav a{color:#eef1f8!important;text-decoration:none;font-weight:650}.pb-global-footer nav a:hover{text-decoration:underline}.pb-footer-copy{white-space:nowrap;font-size:.88rem!important}
      #pb-mobile-nav{display:none}
      @media(max-width:900px){header.pb-global-header .header-contenido{align-items:flex-start!important;flex-direction:column!important;gap:8px!important;padding:10px 16px!important}header.pb-global-header .nav-principal{width:100%!important;justify-content:flex-start!important;overflow-x:auto!important;flex-wrap:nowrap!important;padding-bottom:2px!important}header.pb-global-header .nav-principal a{font-size:.88rem!important;padding:8px 10px!important}.pb-footer-inner{grid-template-columns:1fr;gap:18px}}
      @media(max-width:700px){body{padding-bottom:64px!important}#pb-mobile-nav{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fff;border-top:1px solid #e1e4ee;box-shadow:0 -5px 20px rgba(29,35,58,.08)}#pb-mobile-nav a{padding:10px 4px 9px;text-align:center;text-decoration:none;color:#687087;font-size:.73rem;font-weight:750}#pb-mobile-nav a span{display:block;font-size:1.05rem;margin-bottom:2px}#pb-mobile-nav a[aria-current="page"]{color:#565bd6;background:#f6f5ff}.pb-article-progress{margin:12px 14px 18px;align-items:flex-start;flex-direction:column}.pb-footer-copy{white-space:normal}}
    `;
    document.head.appendChild(style);
  }

  function navHtml() {
    return NAV_ITEMS.map(([href,text]) => {
      const current = activeSection(href) ? ' aria-current="page"' : '';
      const classes = '';
      const panelAttr = href === '/mi-panel/' ? ' data-pb-nav="panel"' : '';
      return `<a href="${href}"${classes}${current}${panelAttr}>${text}</a>`;
    }).join('');
  }

  function normalizarCabecera() {
    asegurarEstilosGlobales();
    let header = document.querySelector('body > header, header');
    if (!header) {
      header = document.createElement('header');
      document.body.insertBefore(header, document.body.firstChild);
    }
    const expectedPath = location.pathname;
    const alreadyCurrent = header.dataset.pbHeaderVersion === HEADER_VERSION && header.dataset.pbHeaderPath === expectedPath;
    if (!alreadyCurrent) {
      header.className = 'pb-global-header';
      header.dataset.pbHeaderVersion = HEADER_VERSION;
      header.dataset.pbHeaderPath = expectedPath;
      header.innerHTML = `<div class="header-contenido"><a href="/" class="logo logo-enlace" aria-label="Ir al inicio">Papeles del <span>Bebé</span></a><nav class="nav-principal" aria-label="Navegación principal">${navHtml()}</nav></div>`;
    }
    actualizarBadgePanel();
  }

  function actualizarBadgePanel() {
    const link = document.querySelector('[data-pb-nav="panel"]');
    if (!link) return;
    const count = progressCount();
    let badge = link.querySelector('.pb-progress-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'pb-progress-badge';
      link.appendChild(badge);
    }
    const text = count === MASTER_KEYS.length ? `${count}/7 ✓` : `${count}/7`;
    const aria = `${count} de 7 bloques completados`;
    if (badge.textContent !== text) badge.textContent = text;
    if (badge.getAttribute('aria-label') !== aria) badge.setAttribute('aria-label', aria);
  }

  function normalizarFooter() {
    let footer = document.querySelector('footer');
    if (!footer) { footer = document.createElement('footer'); document.body.appendChild(footer); }
    if (footer.dataset.pbFooterVersion === FOOTER_VERSION) return;
    footer.className = 'pb-global-footer';
    footer.dataset.pbFooterVersion = FOOTER_VERSION;
    footer.innerHTML = `<div class="pb-footer-inner"><div><a class="pb-footer-brand" href="/">Papeles del <span>Bebé</span></a><p>Menos papeleo. Más tiempo para tu bebé.</p></div><nav aria-label="Navegación del pie"><a href="/mi-panel/">Mi panel</a><a href="/herramientas/">Herramientas</a><a href="/guias-familias/">Guías</a><a href="/ayudas-nacimiento/">Ayudas</a><a href="/tramites-bebe/">Trámites</a><a href="/observatorio/">Observatorio</a><a href="/preparativos-bebe/">🧸 Preparativos</a><a href="/metodologia/">Metodología</a><a href="/privacidad/">Privacidad</a></nav><p class="pb-footer-copy">© 2026 Papeles del Bebé</p></div>`;
  }

  function renderMobileNav() {
    if (document.getElementById('pb-mobile-nav')) return;
    const nav = document.createElement('nav');
    nav.id = 'pb-mobile-nav';
    nav.setAttribute('aria-label','Navegación móvil');
    const items = [['/mi-panel/','✓','Panel'],['/ayudas-nacimiento/','€','Ayudas'],['/tramites-bebe/','☑','Trámites'],['/herramientas/','◈','Herramientas']];
    nav.innerHTML = items.map(([href,icon,label]) => `<a href="${href}"${activeSection(href) ? ' aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${label}</a>`).join('');
    document.body.appendChild(nav);
  }

  function keyForPath(pathname) {
    if (/registro-civil|comprobar-nacimiento-inscrito/.test(pathname)) return 'registro';
    if (/alta-bebe-seguridad-social|incluir-bebe-beneficiario-seguridad-social/.test(pathname)) return 'seguridad-social';
    if (/tarjeta-sanitaria-bebe/.test(pathname)) return 'tarjeta-sanitaria';
    if (/empadron/.test(pathname)) return 'padron';
    if (/prestacion-nacimiento|solicitar-permiso-nacimiento-online|como-saber-prestacion|cuando-paga-seguridad-social/.test(pathname)) return 'prestacion';
    if (/deduccion-maternidad/.test(pathname)) return 'deduccion';
    if (/^\/(ayuda|ayudas|bono-|tarxeta-|familias-|deduccion-nacimiento-)/.test(pathname)) return 'ayudas';
    return '';
  }

  function etiquetaKey(key) {
    return { registro:'Registro Civil', 'seguridad-social':'Seguridad Social', 'tarjeta-sanitaria':'Tarjeta sanitaria', padron:'Empadronamiento', prestacion:'Prestación por nacimiento', deduccion:'Deducción por maternidad', ayudas:'Ayudas' }[key] || 'Este paso';
  }

  function renderArticleProgress() {
    const key = keyForPath(location.pathname);
    const main = document.querySelector('main');
    if (!key || !main || location.pathname.startsWith('/herramientas/') || location.pathname.startsWith('/mi-panel/')) return;
    let box = document.getElementById('pb-article-progress');
    if (!box) {
      box = document.createElement('section');
      box.id = 'pb-article-progress';
      const breadcrumbs = main.querySelector('.breadcrumbs-visibles, .breadcrumbs');
      if (breadcrumbs && breadcrumbs.nextSibling) main.insertBefore(box, breadcrumbs.nextSibling); else main.insertBefore(box, main.firstChild);
    }
    const done = readMaster()[key] === true;
    const reviewOnly = key === 'ayudas' || key === 'deduccion';
    const signature = `${key}:${done ? '1' : '0'}:${reviewOnly ? '1' : '0'}`;
    if (box.dataset.pbRenderSignature === signature) return;
    box.dataset.pbRenderSignature = signature;
    box.className = `pb-article-progress${done ? ' is-done' : ''}`;
    box.innerHTML = `<div><strong>${done ? '✓ ' : ''}${etiquetaKey(key)} · ${done ? (reviewOnly ? 'revisado' : 'hecho') : 'pendiente'}</strong><p>Este estado se comparte con Mi panel y la checklist.</p></div><div class="pb-article-progress-actions"><button type="button" data-pb-toggle-progress="${key}">${done ? (reviewOnly ? 'Marcar como pendiente' : 'Desmarcar') : (reviewOnly ? 'Marcar como revisado' : 'Marcar como hecho')}</button><a href="/mi-panel/" data-pb-open-panel>Abrir Mi panel →</a></div>`;
    box.querySelector('button').addEventListener('click', () => {
      const next = readMaster();
      next[key] = !done;
      writeMaster(next);
    });
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
        if (master[key]) completedSet.add(id); else completedSet.delete(id);
      }
      if (!box.dataset.pbMasterBound) {
        box.dataset.pbMasterBound = '1';
        box.addEventListener('change', () => { const next = readMaster(); next[key] = box.checked; writeMaster(next); });
      }
      if (typeof window.actualizarAspectoTramite === 'function') { try { window.actualizarAspectoTramite(box); } catch (_) {} }
    });
    writeLocal(APP_COMPLETED_KEY, Array.from(completedSet));
    if (typeof window.actualizarContador === 'function') { try { window.actualizarContador(); } catch (_) {} }
  }

  function syncPrintableChecklist() {
    if (!location.pathname.startsWith('/checklist-imprimible/')) return;
    const boxes = Array.from(document.querySelectorAll('section[aria-label="Lista de trámites"] input[type="checkbox"]'));
    const keys = ['registro','registro','seguridad-social','tarjeta-sanitaria','padron','prestacion','ayudas','deduccion'];
    const master = readMaster();
    boxes.forEach((box,index) => {
      const key = keys[index]; if (!key) return;
      if (typeof master[key] === 'boolean') box.checked = master[key];
      if (!box.dataset.pbMasterBound) { box.dataset.pbMasterBound='1'; box.addEventListener('change',()=>{ const next=readMaster(); next[key]=box.checked; writeMaster(next); }); }
    });
  }

  function syncSimpleProgress() {
    document.querySelectorAll('input[type="checkbox"][data-key]').forEach((box) => {
      const key = box.dataset.key; if (!MASTER_KEYS.includes(key)) return;
      const master = readMaster();
      if (typeof master[key] === 'boolean' && box.checked !== master[key]) box.checked = master[key];
      if (!box.dataset.pbMasterBound) { box.dataset.pbMasterBound='1'; box.addEventListener('change',()=>{ const next=readMaster(); next[key]=box.checked; writeMaster(next); }); }
    });
  }


  function aplicar() {
    normalizarCabecera();
    normalizarFooter();
    renderMobileNav();
    syncAppChecklist();
    syncPrintableChecklist();
    syncSimpleProgress();
    renderArticleProgress();
    actualizarBadgePanel();
  }

  migrateLegacyProgress();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicar, { once:true }); else aplicar();
  window.addEventListener('storage', aplicar);
  window.addEventListener('papelesbebe:progress', aplicar);

  document.addEventListener('click', (event) => {
    const panelLink = event.target.closest('a[data-pb-open-panel]');
    if (!panelLink) return;
    event.preventDefault();
    window.location.assign('/mi-panel/');
  });

  let pendiente = false;
  const iniciarObserver = () => {
    if (!document.body) return;
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => {
        const target = mutation.target;
        if (!(target instanceof Element)) return true;
        return !target.closest('#pb-article-progress, .pb-global-header, .pb-global-footer, #pb-mobile-nav');
      });
      if (!relevant || pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => { pendiente = false; aplicar(); });
    });
    observer.observe(document.body, { childList:true, subtree:true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarObserver, { once:true }); else iniciarObserver();
})();