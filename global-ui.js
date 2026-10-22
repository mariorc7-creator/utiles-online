(() => {
  if (window.__papelesBebeGlobalUiInitialized) return;
  window.__papelesBebeGlobalUiInitialized = true;
  const MASTER_KEY = 'papelesbebe_que_me_falta_v1';
  const APP_COMPLETED_KEY = 'tramitesFacilesCompletados';
  const HEADER_VERSION = '20261021-mobile-nav';
  const FOOTER_VERSION = '20261020-3';
  const MASTER_KEYS = ['registro','seguridad-social','tarjeta-sanitaria','padron','prestacion','deduccion','ayudas'];
  const NAV_ITEMS = [
    ['/mi-panel/', 'Mis trámites'],
    ['/ayudas-nacimiento/', 'Ayudas'],
    ['/herramientas/', 'Herramientas'],
    ['/guias-familias/', 'Guías'],
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
      /* Mantener las dos tarjetas en un flujo estable al cambiar de estado. */
      html.pb-journey #pb-journey-chrome{display:flex!important;flex-direction:column!important;gap:14px!important}
      html.pb-journey #pb-journey-chrome #pb-route-context,
      html.pb-journey #pb-journey-chrome #pb-article-progress{margin:0!important;flex-shrink:0}
      html.pb-journey main > .badge,html.pb-journey main > .hero + .badge{display:none!important}

      /* Shell único por encima de la guía: nunca dentro del recuadro del artículo. */
      html.pb-journey #pb-journey-chrome{width:min(100% - 40px,1100px);max-width:1100px;margin:26px auto 0;padding:0;box-sizing:border-box}
      html.pb-journey #pb-journey-chrome #pb-route-context,
      html.pb-journey #pb-journey-chrome #pb-article-progress{display:flex!important;align-items:center;justify-content:space-between;gap:18px;box-sizing:border-box;width:100%!important;max-width:none!important;margin:0 0 18px!important;padding:18px 22px!important;background:#f8f9ff!important;border:1px solid #dce3f2!important;border-radius:17px!important;box-shadow:none!important}
      html.pb-journey #pb-journey-chrome .pb-article-progress-actions{display:flex;flex-wrap:wrap;align-items:center;gap:9px}
      html.pb-journey #pb-journey-chrome .pb-article-progress-actions button,
      html.pb-journey #pb-journey-chrome .pb-article-progress-actions a{min-height:43px;box-sizing:border-box}
      html.pb-journey main{padding-top:0!important}
      html.pb-journey main>.badge{display:none!important}
      @media(max-width:700px){
        html.pb-journey #pb-journey-chrome{width:calc(100% - 24px);margin-top:14px}
        html.pb-journey #pb-journey-chrome #pb-route-context,
        html.pb-journey #pb-journey-chrome #pb-article-progress{padding:14px!important;margin-bottom:12px!important}
        html.pb-journey #pb-journey-chrome #pb-article-progress{flex-direction:column;align-items:stretch}
        html.pb-journey #pb-journey-chrome .pb-article-progress-actions{display:grid;grid-template-columns:1fr}
        html.pb-journey #pb-journey-chrome .pb-article-progress-actions>*{width:100%;text-align:center}
      }

      /* Consistent warm backdrop and white cards across all seven route templates. */
      html.pb-journey, html.pb-journey body { background:linear-gradient(115deg,#fff4f0 0%,#fcfafb 48%,#f4f2ff 100%) fixed!important; }
      html.pb-journey main { background:transparent!important; }
      html.pb-journey main > .hero,html.pb-journey main > .hero-guide,html.pb-journey main > .tools-hero { background:#fff!important;border:1px solid #dfe4f0!important; }
      html.pb-journey main > #pb-route-context,html.pb-journey main > #pb-article-progress { background:#f8f9ff!important;border:1px solid #dce3f2!important; }
      @media(max-width:700px){html.pb-journey,html.pb-journey body{background:#faf9fd!important}}

      .pb-journey main > .badge{display:none!important}
      .pb-journey main > .breadcrumbs-visibles,.pb-journey main > .crumbs,.pb-journey main > .tool-breadcrumb{order:3!important}
      .pb-journey main > #pb-article-progress{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important}
      .pb-journey main > #pb-article-progress .pb-article-progress-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .pb-journey main > #pb-article-progress button,.pb-journey main > #pb-article-progress a{min-height:42px;box-sizing:border-box}
      .pb-journey main > .hero,.pb-journey main > .hero-guide,.pb-journey main > .tools-hero{padding:30px!important;margin-top:0!important}
      @media(max-width:700px){.pb-journey main > #pb-article-progress{flex-direction:column!important;align-items:stretch!important}.pb-journey main > #pb-article-progress .pb-article-progress-actions{display:grid!important;grid-template-columns:1fr!important}.pb-journey main > #pb-article-progress .pb-article-progress-actions>*{width:100%;text-align:center}.pb-journey main > .hero,.pb-journey main > .hero-guide,.pb-journey main > .tools-hero{padding:20px!important}}

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
      @media(min-width:701px){#pb-article-progress{max-width:940px!important;padding:12px 16px!important;gap:10px!important;box-shadow:none!important}#pb-article-progress p{font-size:.79rem!important;margin:3px 0 0!important}#pb-article-progress .pb-article-progress-actions{gap:7px!important}#pb-article-progress .pb-article-progress-actions a,#pb-article-progress .pb-article-progress-actions button{font-size:.82rem!important;padding:8px 10px!important;min-height:38px!important}#pb-article-progress .pb-next-step-link{background:#6067e8!important;color:#fff!important;-webkit-text-fill-color:#fff!important}}
      footer.pb-global-footer{margin-top:48px!important;background:#182035!important;color:#dfe4f0!important;border-top:0!important;padding:0!important}.pb-footer-inner{max-width:1180px;margin:0 auto;padding:34px 24px;display:grid;grid-template-columns:1.1fr 2fr auto;gap:28px;align-items:start;box-sizing:border-box}.pb-footer-brand{font-weight:850;font-size:1.15rem;color:#fff!important;text-decoration:none}.pb-footer-brand span{color:#8f94ff}.pb-global-footer p{color:#b8c0d2!important;margin:8px 0 0!important}.pb-global-footer nav{display:flex;gap:10px 18px;flex-wrap:wrap}.pb-global-footer nav a{color:#eef1f8!important;text-decoration:none;font-weight:650}.pb-global-footer nav a:hover{text-decoration:underline}.pb-footer-copy{white-space:nowrap;font-size:.88rem!important}
      #pb-mobile-nav{display:none}
      @media(max-width:900px){header.pb-global-header .header-contenido{align-items:flex-start!important;flex-direction:column!important;gap:8px!important;padding:10px 16px!important}header.pb-global-header .nav-principal{width:100%!important;justify-content:flex-start!important;overflow-x:auto!important;flex-wrap:nowrap!important;padding-bottom:2px!important}header.pb-global-header .nav-principal a{font-size:.88rem!important;padding:8px 10px!important}.pb-footer-inner{grid-template-columns:1fr;gap:18px}}
      /* Mobile: one navigation at the bottom; top header is branding only. */
      @media(max-width:700px){
        header.pb-global-header .header-contenido{min-height:56px!important;height:auto!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:0!important;padding:8px 16px!important}
        header.pb-global-header .nav-principal,header.pb-global-header .header-acciones{display:none!important}
        header.pb-global-header .logo-enlace{margin:0!important}
        body{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))!important}
        #pb-mobile-nav{grid-template-columns:repeat(5,minmax(0,1fr))!important;padding-bottom:env(safe-area-inset-bottom,0px)!important}
        #pb-mobile-nav a{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-width:0!important;min-height:62px!important;padding:7px 1px 5px!important;font-size:clamp(.59rem,2.35vw,.73rem)!important;line-height:1.12!important;white-space:normal!important}
        #pb-mobile-nav a span{font-size:1.18rem!important;margin-bottom:5px!important}
      }
      @media(max-width:700px){#pb-article-progress{margin:8px 12px 12px!important;padding:10px 12px!important;gap:7px!important;border-radius:12px!important;box-shadow:none!important}#pb-article-progress strong{font-size:14px!important}#pb-article-progress p{display:none!important}#pb-article-progress .pb-article-progress-actions{width:100%;gap:7px!important}#pb-article-progress .pb-article-progress-actions button,#pb-article-progress .pb-article-progress-actions a{font-size:12px!important;min-height:38px!important;padding:8px 10px!important}#pb-article-progress .pb-article-progress-actions a[data-pb-open-panel]{display:none!important}#pb-article-progress .pb-next-step-link{background:#6067e8!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border-color:#6067e8!important}body{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))!important}#pb-mobile-nav{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#fff;border-top:1px solid #e1e4ee;box-shadow:0 -5px 20px rgba(29,35,58,.08)}#pb-mobile-nav a{padding:10px 4px 9px;text-align:center;text-decoration:none;color:#687087;font-size:.73rem;font-weight:750}#pb-mobile-nav a span{display:block;font-size:1.05rem;margin-bottom:2px}#pb-mobile-nav a[aria-current="page"]{color:#565bd6;background:#f6f5ff}.pb-article-progress{margin:12px 14px 18px;align-items:flex-start;flex-direction:column}.pb-footer-copy{white-space:normal}}
    `;
    // Orden uniforme: ruta > estado > migas > guía; eliminar el badge decorativo heredado.
    const normalizeJourney = () => {
      const main = document.querySelector('main');
      if (!main) return;
      const route = main.querySelector('#pb-route-context');
      const status = main.querySelector('#pb-article-progress');
      if (route && main.firstElementChild !== route) main.prepend(route);
      if (route && status && route.nextElementSibling !== status) route.insertAdjacentElement('afterend',status);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',normalizeJourney,{once:true});
    else normalizeJourney();
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
    footer.innerHTML = `<div class="pb-footer-inner"><div><a class="pb-footer-brand" href="/">Papeles del <span>Bebé</span></a><p>Menos papeleo. Más tiempo para tu bebé.</p></div><nav aria-label="Navegación del pie"><a href="/mi-panel/">Mis trámites</a><a href="/ayudas-nacimiento/">Ayudas</a><a href="/herramientas/">Herramientas</a><a href="/guias-familias/">Guías</a><a href="/preparativos-bebe/">🧸 Preparativos</a><a href="/observatorio/">📊 Observatorio de ayudas</a><a href="/metodologia/">Cómo revisamos</a><a href="/quienes-somos/">Quiénes somos</a><a href="/aviso-legal/">Aviso legal</a><a href="/cookies/">Cookies</a><a href="/contacto/">Contacto</a><a href="/privacidad/">Privacidad</a></nav><p class="pb-footer-copy">© 2026 Papeles del Bebé</p></div>`;
  }

  function renderMobileNav() {
    if (document.getElementById('pb-mobile-nav')) return;
    const nav = document.createElement('nav');
    nav.id = 'pb-mobile-nav';
    nav.setAttribute('aria-label','Navegación móvil');
    const items = [['/mi-panel/','✓','Trámites'],['/ayudas-nacimiento/','€','Ayudas'],['/herramientas/','◈','Herramientas'],['/guias-familias/','▤','Guías'],['/preparativos-bebe/','🧸','Preparativos']];
    nav.innerHTML = items.map(([href,icon,label]) => `<a href="${href}"${activeSection(href) ? ' aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${label}</a>`).join('');
    document.body.appendChild(nav);
  }

  function keyForPath(pathname) {
    if (/registro-civil|comprobar-nacimiento-inscrito/.test(pathname)) return 'registro';
    if (/alta-bebe-seguridad-social|incluir-bebe-beneficiario-seguridad-social/.test(pathname)) return 'seguridad-social';
    if (/tarjeta-sanitaria-bebe/.test(pathname)) return 'tarjeta-sanitaria';
    if (/empadron/.test(pathname)) return 'padron';
    if (/prestacion-nacimiento|permiso-nacimiento-cuidado-menor|solicitar-permiso-nacimiento-online|como-saber-prestacion|cuando-paga-seguridad-social/.test(pathname)) return 'prestacion';
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
    if (!key || !main || location.pathname.startsWith('/herramientas/') || location.pathname.startsWith('/mi-panel/') || location.pathname === '/ayudas-nacimiento/') return;
    let box = document.getElementById('pb-article-progress');
    if (!box) {
      box = document.createElement('section');
      box.id = 'pb-article-progress';
      const breadcrumbs = main.querySelector('.breadcrumbs-visibles, .breadcrumbs');
      const route = main.querySelector('#pb-route-context');
      if (route) route.insertAdjacentElement('afterend', box);
      else if (breadcrumbs) breadcrumbs.insertAdjacentElement('afterend', box);
      else main.insertBefore(box, main.firstChild);
    }
    const route = document.getElementById('pb-route-context');
    const shell = document.getElementById('pb-journey-chrome');
    if (shell && box.parentNode !== shell) shell.appendChild(box);
    else if (!shell && route && box.previousElementSibling !== route) route.insertAdjacentElement('afterend', box);
    const done = readMaster()[key] === true;
    const reviewOnly = key === 'ayudas' || key === 'deduccion';
    const steps = [
      ['registro','Registro Civil','/registro-civil-bebe/'],
      ['seguridad-social','Seguridad Social','/incluir-bebe-beneficiario-seguridad-social/'],
      ['tarjeta-sanitaria','Tarjeta sanitaria','/tarjeta-sanitaria-bebe/'],
      ['padron','Empadronamiento','/empadronar-bebe/'],
      ['prestacion','Permiso y prestación','/permiso-nacimiento-cuidado-menor-2026/'],
      ['deduccion','Deducciones','/deduccion-maternidad/'],
      ['ayudas','Ayudas','/ayudas-nacimiento/']
    ];
    const nextStep = steps.find(([stepKey]) => readMaster()[stepKey] !== true);
    const mobile = window.matchMedia('(max-width:700px)').matches;
    const signature = `${key}:${done ? '1' : '0'}:${reviewOnly ? '1' : '0'}:${nextStep ? nextStep[0] : 'all'}`;
    if (box.dataset.pbRenderSignature === signature) return;
    box.dataset.pbRenderSignature = signature;
    box.className = `pb-article-progress${done ? ' is-done' : ''}`;
    const forward = nextStep && (nextStep[0] !== key || done)
      ? `<a class="pb-next-step-link" href="${nextStep[2]}">Paso siguiente: ${nextStep[1]} →</a>`
      : (!nextStep ? '<a class="pb-next-step-link" href="/mi-panel/">Finalizado ✓ Ver mi resumen</a>' : '');
    box.innerHTML = `<div><strong>${done ? '✓ ' : ''}${etiquetaKey(key)} · ${done ? (reviewOnly ? 'revisado' : 'hecho') : 'pendiente'}</strong><p>Este estado se comparte con Mi panel y la checklist.</p></div><div class="pb-article-progress-actions"><button type="button" data-pb-toggle-progress="${key}">${done ? (reviewOnly ? 'Marcar como pendiente' : 'Desmarcar') : (reviewOnly ? 'Marcar como revisado' : 'Marcar como hecho')}</button>${forward}<a href="/mi-panel/" data-pb-open-panel>Abrir Mi panel →</a></div>`;
    box.querySelector('button').addEventListener('click', () => {
      const next = readMaster();
      next[key] = !done;
      writeMaster(next);
      // Mantener a la vista la acción siguiente tras marcar el trámite.
      requestAnimationFrame(() => {
        const updated = document.getElementById('pb-article-progress');
        const follow = updated && updated.querySelector('.pb-next-step-link');
        if (follow && next[key]) {
          updated.scrollIntoView({block:'start',behavior:'smooth'});
          follow.focus({preventScroll:true});
        }
      });
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


  function ensureJourneyShell() {
    const steps = [
      ['/registro-civil-bebe/','Registro Civil','🧾'],
      ['/incluir-bebe-beneficiario-seguridad-social/','Seguridad Social','👶'],
      ['/tarjeta-sanitaria-bebe/','Tarjeta sanitaria','🏥'],
      ['/empadronar-bebe/','Empadronamiento','🏠'],
      ['/permiso-nacimiento-cuidado-menor-2026/','Prestación y permiso','🗓️'],
      ['/permiso-nacimiento-cuidado-menor/','Prestación y permiso','🗓️'],
      ['/deduccion-maternidad/','Deducciones','💳'],
      ['/ayudas-nacimiento/','Ayudas','💶']
    ];
    const i = steps.findIndex(step => step[0] === location.pathname.replace(/\/?$/, '/'));
    if (i === -1) return;
    const main = document.querySelector('main');
    if (!main || !main.parentNode) return;
    let shell = document.getElementById('pb-journey-chrome');
    if (!shell) {
      shell = document.createElement('div');
      shell.id = 'pb-journey-chrome';
      main.parentNode.insertBefore(shell, main);
    }
    let route = document.getElementById('pb-route-context');
    if (!route) {
      route = document.createElement('div');
      route.id = 'pb-route-context';
      route.className = 'pb-route-context';
    }
    const number = i > 4 ? i : i + 1;
    const percent = Math.round(number * 100 / 7);
    const current = steps[i];
    const signature = String(number);
    if (route.dataset.step !== signature) {
      route.dataset.step = signature;
      route.innerHTML = `<div class="pb-route-copy"><span>TU RUTA · ${number}/7</span><strong>${current[2]} ${current[1]}</strong></div><div class="pb-route-progress"><b>${percent}%</b><span class="pb-route-track"><i style="width:${percent}%"></i></span></div>`;
    }
    if (route.parentNode !== shell || shell.firstElementChild !== route) shell.prepend(route);
    const status = document.getElementById('pb-article-progress');
    if (status && status.parentNode !== shell) shell.appendChild(status);
    // Estas dos tarjetas son hermanas del main y no quedan dentro de la caja del artículo.
  }

  function aplicar() {
    normalizarCabecera();
    normalizarFooter();
    renderMobileNav();
    syncAppChecklist();
    syncPrintableChecklist();
    syncSimpleProgress();
    renderArticleProgress();
    ensureJourneyShell();
    actualizarBadgePanel();
  }

  // Plantilla visual única para el recorrido principal, independiente del tipo de página.
  const journeyPaths = new Set([
    '/registro-civil-bebe/',
    '/incluir-bebe-beneficiario-seguridad-social/',
    '/tarjeta-sanitaria-bebe/',
    '/empadronar-bebe/',
    '/permiso-nacimiento-cuidado-menor-2026/',
    '/permiso-nacimiento-cuidado-menor/',
    '/deduccion-maternidad/',
    '/ayudas-nacimiento/'
  ]);
  if (journeyPaths.has(location.pathname)) {
    document.documentElement.classList.add('pb-journey');
    const style = document.createElement('style');
    style.id = 'pb-journey-design';
    style.textContent = `
      .pb-journey body { background:#fafbff; }
      .pb-journey main { width:min(100% - 40px,1100px)!important; max-width:1100px!important; margin:0 auto!important; padding:26px 0 70px!important; box-sizing:border-box; }
      /* Evitar que las secciones queden pegadas al borde del main. */
      .pb-journey main { padding-left:clamp(16px,3vw,32px)!important;padding-right:clamp(16px,3vw,32px)!important; }
      .pb-journey main > .badge, .pb-journey main > .breadcrumbs-visibles, .pb-journey main > .crumbs,
      .pb-journey main > .tool-breadcrumb { position:relative; }
      .pb-journey main > #pb-route-context, .pb-journey main > #pb-article-progress,
      .pb-journey main > #pb-aid-step-final { border:1px solid #dbe2f1!important;background:#f8faff!important; }
      .pb-journey main > .hero, .pb-journey main > .hero-guide,
      .pb-journey main > .tools-hero { border:1px solid #dce3f2!important;box-shadow:0 8px 28px rgba(32,46,90,.035)!important; }
      .pb-journey main > .badge { margin-bottom:20px!important; }
      .pb-journey main > .hero, .pb-journey main > .hero-guide, .pb-journey main > .tools-hero { margin-top:12px!important; }
      .pb-journey main > #pb-route-context, .pb-journey main > #pb-article-progress,
      .pb-journey main > #pb-aid-step-final { width:100%!important;max-width:none!important;box-sizing:border-box!important;border-radius:16px!important;box-shadow:none!important; }
      .pb-journey main > #pb-route-context { margin:0 0 14px!important;padding:17px 20px!important; }
      .pb-journey main > #pb-article-progress, .pb-journey main > #pb-aid-step-final { margin:0 0 24px!important;padding:16px 20px!important; }
      .pb-journey main > .breadcrumbs-visibles, .pb-journey main > .crumbs,
      .pb-journey main > .tool-breadcrumb { margin:0 0 19px!important;padding:0!important;font-size:.86rem!important; }
      .pb-journey main > .hero, .pb-journey main > .hero-guide,
      .pb-journey main > .tools-hero { width:100%!important;max-width:none!important;box-sizing:border-box!important;margin:0 0 26px!important;padding:34px clamp(20px,4vw,42px)!important;border-radius:22px!important;background:#fff!important;border:1px solid #e5e9f4!important;text-align:left!important;box-shadow:none!important; }
      .pb-journey main > .hero h1, .pb-journey main > .hero-guide h1,
      .pb-journey main > .tools-hero h1 { font-size:clamp(2rem,4.2vw,3.2rem)!important;line-height:1.12!important;letter-spacing:-.035em!important;max-width:900px!important;margin:18px 0 18px!important;text-align:left!important; }
      .pb-journey main > .hero .subtitle, .pb-journey main > .hero-guide .lead,
      .pb-journey main > .tools-hero > p { font-size:clamp(1rem,1.7vw,1.12rem)!important;line-height:1.65!important;max-width:850px!important;margin:0 0 20px!important;text-align:left!important; }
      .pb-journey main > .hero .badge,.pb-journey main > .hero-guide .eyebrow,
      .pb-journey main > .tools-hero .tool-kicker { margin:0!important;display:inline-flex!important;font-size:.79rem!important; }
      .pb-journey main .contenido-informativo { text-align:left!important; }
      .pb-journey main .pb-hub-panel { margin:24px 0!important; }
      .pb-journey main .pb-observatorio-feature { margin:24px 0!important; }
      .pb-journey main #pb-aid-step-final button {min-height:44px!important}
      @media(max-width:700px){
        .pb-journey main {width:calc(100% - 16px)!important;padding:14px 12px 86px!important}
        .pb-journey main > #pb-route-context {margin-bottom:10px!important;padding:13px 14px!important}
        .pb-journey main > #pb-article-progress,.pb-journey main > #pb-aid-step-final {margin-bottom:17px!important;padding:14px!important}
        .pb-journey main > .hero,.pb-journey main > .hero-guide,.pb-journey main > .tools-hero {padding:22px 17px!important;border-radius:16px!important;margin-bottom:18px!important}
        .pb-journey main > .hero h1,.pb-journey main > .hero-guide h1,.pb-journey main > .tools-hero h1 {font-size:clamp(1.75rem,7vw,2.25rem)!important;margin:14px 0!important}
        .pb-journey main > .hero .subtitle,.pb-journey main > .hero-guide .lead,.pb-journey main > .tools-hero > p {font-size:.96rem!important;line-height:1.55!important}
      }
    `;
    document.head.appendChild(style);
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

  // Páginas estáticas: aplicar al cargar y cuando cambie el progreso.
  // Evitar reescaneos y mutaciones en cascada del DOM en dispositivos móviles.
})();