(() => {
  if (window.__pbUxFocusLoaded) return;
  window.__pbUxFocusLoaded = true;

  const WORKSPACE_KEY = 'papelesbebe_workspace_v1';
  const PROGRESS_KEY = 'papelesbebe_que_me_falta_v1';
  const CONTEXT_KEY = 'papelesbebe_shared_context_v1';
  const ROUTE = [
    {key:'registro',label:'Registro Civil',href:'/registro-civil-bebe/',icon:'🧾'},
    {key:'seguridad-social',label:'Seguridad Social',href:'/alta-bebe-seguridad-social/',icon:'👶'},
    {key:'tarjeta-sanitaria',label:'Tarjeta sanitaria',href:'/tarjeta-sanitaria-bebe/',icon:'🏥'},
    {key:'padron',label:'Empadronamiento',href:'/empadronar-bebe/',icon:'🏠'},
    {key:'prestacion',label:'Prestación y permiso',href:'/permiso-nacimiento-cuidado-menor-2026/',icon:'🗓️'},
    {key:'deduccion',label:'Deducciones',href:'/deduccion-maternidad/',icon:'💳'},
    {key:'ayudas',label:'Ayudas',href:'/ayudas-nacimiento/',icon:'💶'}
  ];

  const css = document.createElement('style');
  css.textContent = `
    /* Sistema visual de acciones: un primario claro, secundarios neutros */
    .cta-enlace:not(.secondary),.tool-cta:not(.secondary),.panel-btn:not(.secondary),.qmf-btn:not(.secondary),.home-hero-cta button,.pb-focus-actions a:not(.secondary),.pb-focus-actions button:not(.secondary){background:#6067e8!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border-color:#6067e8!important;font-weight:850!important}
    .cta-enlace:not(.secondary):hover,.tool-cta:not(.secondary):hover,.panel-btn:not(.secondary):hover,.qmf-btn:not(.secondary):hover,.home-hero-cta button:hover,.pb-focus-actions a:not(.secondary):hover{background:#4f56d9!important;color:#fff!important;-webkit-text-fill-color:#fff!important}
    .cta-enlace:focus-visible,.tool-cta:focus-visible,.panel-btn:focus-visible,.qmf-btn:focus-visible,.pb-focus-actions a:focus-visible,.pb-focus-actions button:focus-visible{outline:3px solid rgba(96,103,232,.28)!important;outline-offset:3px!important}
    .pb-focus-actions .secondary,.tool-cta.secondary,.panel-btn.secondary,.qmf-btn.secondary{background:#fff!important;color:#4e54c8!important;-webkit-text-fill-color:#4e54c8!important;border:1px solid #cfd3f5!important}

    .pb-focus-box{margin:18px 0 22px;padding:18px;border:1px solid #dfe2fb;border-radius:20px;background:linear-gradient(135deg,#f8f8ff,#fff);box-shadow:0 8px 28px rgba(48,52,100,.05)}
    .pb-focus-box .pb-kicker{display:block;font-size:.72rem;font-weight:900;letter-spacing:.06em;color:#5960cf;margin-bottom:5px}.pb-focus-box h2{margin:0 0 6px;font-size:1.3rem}.pb-focus-box p{margin:0;color:#62677a;line-height:1.5}.pb-focus-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:13px}.pb-focus-actions a,.pb-focus-actions button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border-radius:11px;text-decoration:none;font-weight:850;background:#6067e8;color:#fff;border:0;cursor:pointer;font:inherit}.pb-focus-actions a.secondary,.pb-focus-actions button.secondary{background:#fff;color:#4e54c8;border:1px solid #d4d7f3}
    .pb-home-more{margin:14px 0;border:1px solid #e4e6ef;border-radius:18px;background:#fff;overflow:hidden}.pb-home-more>summary{cursor:pointer;list-style:none;padding:16px 18px;font-weight:850;color:#353b67;display:flex;align-items:center;justify-content:space-between}.pb-home-more>summary::-webkit-details-marker{display:none}.pb-home-more>summary:after{content:'+';font-size:1.25rem;color:#666}.pb-home-more[open]>summary:after{content:'–'}.pb-home-more[open]>summary{border-bottom:1px solid #ececf3}.pb-home-more>section{margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}
    .pb-returning .home-necesidades{margin-top:14px}.pb-returning .hero-beneficios{display:none}.pb-returning .home-hero-cta .cta-explicacion{display:none}
    .pb-restart-note{margin:10px 0 0;font-size:.84rem;color:#777c8d}.pb-restart-note button{appearance:none;border:0;background:transparent;color:#5c63cf;text-decoration:underline;text-underline-offset:3px;font-weight:800;cursor:pointer;padding:0}
    .pb-tramites-hidden{display:none!important}.pb-more-steps{display:inline-flex;margin:12px 0 4px;padding:10px 14px;border-radius:11px;border:1px solid #d4d7f3;background:#fff;color:#4e54c8;font-weight:850;cursor:pointer}

    .pb-route-context{max-width:1080px;margin:12px auto 18px;padding:12px 14px;border:1px solid #e1e4f5;border-radius:15px;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:14px;box-sizing:border-box;box-shadow:0 5px 18px rgba(48,52,100,.035)}
    .pb-route-copy{min-width:0}.pb-route-copy span{display:block;font-size:.7rem;font-weight:900;letter-spacing:.055em;color:#6a70ca}.pb-route-copy strong{display:block;margin-top:2px;color:#242b46}.pb-route-progress{display:flex;align-items:center;gap:9px;flex:0 0 auto}.pb-route-progress b{font-size:.85rem;color:#5960cf}.pb-route-track{width:92px;height:7px;background:#eceefa;border-radius:999px;overflow:hidden}.pb-route-track i{display:block;height:100%;background:#6067e8;border-radius:999px}.pb-route-status{display:inline-flex;padding:4px 8px;border-radius:999px;font-size:.68rem;font-weight:900;margin-left:7px}.pb-route-status.done{background:#eaf7ef;color:#17633f}.pb-route-status.next{background:#fff3d8;color:#775b18}.pb-route-status.later{background:#f1f2f7;color:#666b7b}

    .pb-mobile-next{display:none}
    @media(max-width:760px){
      .pb-focus-actions a,.pb-focus-actions button{width:100%;box-sizing:border-box}.pb-focus-box{padding:16px}.pb-home-more>summary{padding:14px 15px}
      .pb-route-context{margin:10px 14px 16px;align-items:flex-start}.pb-route-track{width:62px}.pb-route-copy strong{font-size:.9rem}
      .pb-mobile-next{position:fixed;display:none!important;left:10px;right:10px;bottom:calc(75px + env(safe-area-inset-bottom,0px));z-index:9998;align-items:center;justify-content:space-between;gap:10px;padding:10px 11px 10px 14px;border:1px solid #d9ddfb;border-radius:16px;background:rgba(255,255,255,.97);box-shadow:0 12px 34px rgba(38,43,92,.18);backdrop-filter:blur(10px)}
      .pb-mobile-next div{min-width:0}.pb-mobile-next small{display:block;color:#73788b;font-size:.68rem;font-weight:800;text-transform:uppercase}.pb-mobile-next strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.88rem;color:#242b46}.pb-mobile-next a{flex:0 0 auto;padding:9px 12px;border-radius:11px;background:#6067e8;color:#fff!important;-webkit-text-fill-color:#fff!important;text-decoration:none;font-weight:850;font-size:.82rem}
      body:has(.pb-mobile-next){padding-bottom:78px}
    }

    /* Mobile-first: una acción a la vez, sin barra secundaria fija. */
    @media(max-width:700px){
      .pb-mobile-next{display:none!important}
      .home-necesidades{display:none!important}
      .pb-mobile-disclosure{margin:10px 0!important;border:1px solid #e3e6f3;border-radius:13px;background:#fff;overflow:hidden}
      .pb-mobile-disclosure>summary{padding:13px 15px;cursor:pointer;color:#434b88;font-size:.94rem;font-weight:800;list-style-position:inside}
      .pb-mobile-disclosure[open]>summary{border-bottom:1px solid #edf0f7}
      .pb-mobile-disclosure>.pb-pregnancy,.pb-mobile-disclosure>.pb-top-tools{margin:0!important;border:0!important;border-radius:0!important;padding:13px!important;box-shadow:none!important}
      .pb-mobile-disclosure .pb-top-tools h2{font-size:1rem!important}
      body:has(.pb-mobile-next){padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))!important}
      .pb-route-context{margin:8px 12px 10px!important;padding:9px 11px!important;border-radius:11px!important;box-shadow:none!important;gap:8px!important}
      .pb-route-copy span{font-size:.63rem!important}
      .pb-route-copy strong{font-size:.82rem!important}
      .pb-route-status{padding:2px 5px!important;margin-left:4px!important;font-size:.58rem!important}
      .pb-route-progress{gap:4px!important}
      .pb-route-track{width:38px!important}
      .pb-focus-box{margin:12px 0!important;padding:13px!important}
    }
  `;
  document.head.appendChild(css);

  function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}}
  function clearSavedJourney(){
    try {
      localStorage.removeItem(WORKSPACE_KEY);
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem('papelesbebe_recorrido_iniciado_v1');
      sessionStorage.removeItem(CONTEXT_KEY);
    } catch (_) {}
  }
  function progressState(){
    const workspace=readJson(WORKSPACE_KEY);
    // El progreso maestro es la fuente de verdad; workspace.progress puede ser una copia antigua.
    return Object.assign({}, workspace.progress||{}, readJson(PROGRESS_KEY));
  }
  function nextRoute(){
    const progress=progressState();
    return ROUTE.find(x=>!progress[x.key]) || null;
  }

  function enhanceHome(){
    if (location.pathname !== '/' && location.pathname !== '') return;
    const needs = document.querySelector('.home-necesidades');
    const cards = needs ? [...needs.querySelectorAll('.home-necesidad-card')] : [];
    const title = document.getElementById('home-necesidades-titulo');
    if (title) title.textContent = 'Elige cómo quieres empezar';
    if (cards.length >= 3) {
      cards[0].href='/mi-panel/';
      cards[0].querySelector('span').textContent='🧭';
      cards[0].querySelector('strong').textContent='Mis trámites';
      cards[0].querySelector('small').textContent='Tu siguiente paso, en un solo lugar';
      cards[1].href='/herramientas/';
      cards[1].querySelector('span').textContent='⚡';
      cards[1].querySelector('strong').textContent='Ver otras herramientas';
      cards[1].querySelector('small').textContent='Calculadoras, documentos y guías prácticas';
      cards[2].href='/ayudas-nacimiento/';
      cards[2].querySelector('span').textContent='💶';
      cards[2].querySelector('strong').textContent='Buscar ayudas';
      cards[2].querySelector('small').textContent='Prestaciones, deducciones y ayudas de tu comunidad';
    }

    const workspace = readJson(WORKSPACE_KEY);
    const progress = progressState();
    const primaryButton=document.querySelector('.home-hero-cta button');
    if(primaryButton && !ROUTE.some(x=>progress[x.key]===true)) primaryButton.textContent='Ver mi primer paso →';
    const done=ROUTE.filter(x=>progress[x.key]).length;
    if (done > 0 || (workspace.last && workspace.last.path)) {
      document.body.classList.add('pb-returning');
      const hero=document.querySelector('.home-hero-principal');
      const h1=hero?.querySelector('h1');
      const sub=hero?.querySelector('.subtitle');
      const badge=hero?.querySelector('.badge');
      const cta=hero?.querySelector('.home-hero-cta');
      if (badge) badge.textContent='TU PROGRESO GUARDADO';
      if (h1) h1.textContent='Continúa donde lo dejaste';
      if (sub) sub.innerHTML=done ? `<strong>${done} de 7 bloques revisados.</strong> Te enseñamos solo el siguiente paso para que no tengas que volver a empezar.` : 'Tienes un proceso guardado en este navegador. Continúa desde tu panel.';
      if (cta) {
        cta.innerHTML=`<div class="pb-focus-actions" style="justify-content:center"><a class="cta-enlace" href="/mi-panel/">Continuar desde mi panel →</a></div><p class="pb-restart-note">¿Este progreso ya no te sirve? <button type="button" id="pb-start-over">Empezar de nuevo</button></p>`;
        cta.querySelector('#pb-start-over')?.addEventListener('click',()=>{
          if (!window.confirm('¿Quieres borrar el progreso guardado en este navegador y empezar desde cero?')) return;
          clearSavedJourney();
          location.reload();
        });
      }
    }

    const community=document.querySelector('.home-comunidades');
    if (community && !community.closest('.pb-home-more')) {
      const d=document.createElement('details'); d.className='pb-home-more';
      d.innerHTML='<summary>📍 Buscar ayudas por comunidad</summary>';
      community.parentNode.insertBefore(d,community); d.appendChild(community);
    }
    const ia=document.querySelector('.home-papelesia:not(.home-premium-destacado)');
    if (ia && !ia.closest('.pb-home-more')) {
      const d=document.createElement('details'); d.className='pb-home-more';
      d.innerHTML='<summary>✨ Más ayuda si la necesitas</summary>';
      ia.parentNode.insertBefore(d,ia);
      if (ia) d.appendChild(ia);

    }
  }

  function simplifyMobileHome(){
    if (location.pathname !== '/' || !window.matchMedia('(max-width:700px)').matches) return;
    const groups = [
      ['.pb-pregnancy','🤰 Antes del parto'],
      ['.pb-top-tools','🧰 Más herramientas']
    ];
    groups.forEach(([selector,label]) => {
      const section=document.querySelector(selector);
      if (!section || section.closest('details.pb-mobile-disclosure')) return;
      const details=document.createElement('details');
      details.className='pb-mobile-disclosure';
      const summary=document.createElement('summary');
      summary.textContent=label;
      section.parentNode.insertBefore(details,section);
      details.appendChild(summary);
      details.appendChild(section);
    });
  }

  function enhanceTramites(){
    if (!location.pathname.startsWith('/tramites-bebe')) return;
    const hero=document.querySelector('.hero.seo-page');
    const firstContent=hero?.querySelector('.contenido-informativo');
    if (!hero || !firstContent || document.querySelector('.pb-focus-box')) return;
    const oldCta=hero.querySelector(':scope > .cta-enlace');
    if(oldCta) oldCta.textContent='Crear mi plan personalizado →';
    const box=document.createElement('section');
    box.className='pb-focus-box';
    box.innerHTML='<span class="pb-kicker">QUÉ HACER AHORA</span><h2>No intentes resolver los 8 trámites a la vez</h2><p>Marca lo que ya tienes y te mostraremos una única siguiente acción. Si ya sabes qué necesitas, entra directamente en el preparador correspondiente.</p><div class="pb-focus-actions"><a href="/mi-panel/">Decirme qué hago ahora →</a><a class="secondary" href="/preparador-tarjeta-sanitaria/">Tarjeta sanitaria</a><a class="secondary" href="/pack-empadronamiento/">Empadronamiento</a></div>';
    firstContent.parentNode.insertBefore(box,firstContent);

    const articles=[...hero.querySelectorAll('article.seo-text-block')];
    articles.forEach((a,i)=>{ if(i>=4) a.classList.add('pb-tramites-hidden'); });
    if (articles.length>4) {
      const btn=document.createElement('button'); btn.type='button'; btn.className='pb-more-steps'; btn.textContent='Ver los 8 pasos y documentación ↓';
      articles[3].insertAdjacentElement('afterend',btn);
      btn.addEventListener('click',()=>{
        const hidden=[...hero.querySelectorAll('.pb-tramites-hidden')];
        const opening=hidden.length>0;
        articles.forEach((a,i)=>{if(i>=4)a.classList.toggle('pb-tramites-hidden',!opening);});
        btn.textContent=opening?'Mostrar menos ↑':'Ver los 8 pasos y documentación ↓';
      });
    }
  }

  function addRouteContext(){
    if (['/registro-civil-bebe/','/incluir-bebe-beneficiario-seguridad-social/','/tarjeta-sanitaria-bebe/','/empadronar-bebe/','/permiso-nacimiento-cuidado-menor-2026/','/permiso-nacimiento-cuidado-menor/','/deduccion-maternidad/','/ayudas-nacimiento/'].includes(location.pathname)) return;
    const steps=[
      ['/registro-civil-bebe/','Registro Civil','🧾'],
      ['/incluir-bebe-beneficiario-seguridad-social/','Seguridad Social','👶'],
      ['/tarjeta-sanitaria-bebe/','Tarjeta sanitaria','🏥'],
      ['/empadronar-bebe/','Empadronamiento','🏠'],
      ['/permiso-nacimiento-cuidado-menor-2026/','Prestación y permiso','🗓️'],
      ['/deduccion-maternidad/','Deducciones','💳'],
      ['/ayudas-nacimiento/','Ayudas','💶']
    ];
    const path=location.pathname.replace(/\/?$/, '/');
    const index=steps.findIndex(step=>step[0]===path);
    document.getElementById('pb-route-context')?.remove();
    if(index<0)return;
    const number=index+1,percent=Math.round(number/steps.length*100),current=steps[index];
    const box=document.createElement('div');
    box.id='pb-route-context';box.className='pb-route-context';
    box.innerHTML=`<div class="pb-route-copy"><span>TU RUTA · ${number}/7</span><strong>${current[2]} ${current[1]}</strong></div><div class="pb-route-progress"><b>${percent}%</b><span class="pb-route-track"><i style="width:${percent}%"></i></span></div>`;
    const main=document.querySelector('main');
    if(main) main.prepend(box);
  }

  function addMobileNext(){
    document.querySelector('.pb-mobile-next')?.remove();
    const next=nextRoute();
    if(!next) return;
    const path=location.pathname;
    if(path==='/'||path.startsWith('/mi-panel')||path.startsWith('/herramientas/que-me-falta')) return;
    const progress=progressState();
    if(!ROUTE.some(x=>Object.prototype.hasOwnProperty.call(progress,x.key))) return;
    const bar=document.createElement('div');
    bar.className='pb-mobile-next';
    const samePage = (path.replace(/\/?$/, '/') === next.href);
    bar.innerHTML=`<div><small>${samePage ? 'PASO ACTUAL' : 'SIGUIENTE PASO'}</small><strong>${next.icon} ${next.label}</strong></div><a href="${samePage ? '/mi-panel/' : next.href}">${samePage ? 'Ver mi panel →' : 'Continuar →'}</a>`;
    document.body.appendChild(bar);
  }

  function boot(){ enhanceHome(); simplifyMobileHome(); enhanceTramites(); addRouteContext(); addMobileNext(); }
  window.addEventListener('papelesbebe:progress', () => { addRouteContext(); addMobileNext(); });
  window.addEventListener('storage', (event) => { if (!event.key || event.key===PROGRESS_KEY) { addRouteContext(); addMobileNext(); } });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();