(() => {
  if (window.__pbUxFocusLoaded) return;
  window.__pbUxFocusLoaded = true;

  const WORKSPACE_KEY = 'papelesbebe_workspace_v1';
  const PROGRESS_KEY = 'papelesbebe_que_me_falta_v1';
  const CONTEXT_KEY = 'papelesbebe_shared_context_v1';

  const css = document.createElement('style');
  css.textContent = `
    .pb-focus-box{margin:18px 0 22px;padding:18px;border:1px solid #dfe2fb;border-radius:20px;background:linear-gradient(135deg,#f8f8ff,#fff);box-shadow:0 8px 28px rgba(48,52,100,.05)}
    .pb-focus-box .pb-kicker{display:block;font-size:.72rem;font-weight:900;letter-spacing:.06em;color:#5960cf;margin-bottom:5px}.pb-focus-box h2{margin:0 0 6px;font-size:1.3rem}.pb-focus-box p{margin:0;color:#62677a;line-height:1.5}.pb-focus-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:13px}.pb-focus-actions a,.pb-focus-actions button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border-radius:11px;text-decoration:none;font-weight:850;background:#6067e8;color:#fff;border:0;cursor:pointer;font:inherit}.pb-focus-actions a.secondary,.pb-focus-actions button.secondary{background:#fff;color:#4e54c8;border:1px solid #d4d7f3}
    .pb-home-more{margin:14px 0;border:1px solid #e4e6ef;border-radius:18px;background:#fff;overflow:hidden}.pb-home-more>summary{cursor:pointer;list-style:none;padding:16px 18px;font-weight:850;color:#353b67;display:flex;align-items:center;justify-content:space-between}.pb-home-more>summary::-webkit-details-marker{display:none}.pb-home-more>summary:after{content:'+';font-size:1.25rem;color:#666}.pb-home-more[open]>summary:after{content:'–'}.pb-home-more[open]>summary{border-bottom:1px solid #ececf3}.pb-home-more>section{margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}
    .pb-returning .home-necesidades{margin-top:14px}.pb-returning .hero-beneficios{display:none}.pb-returning .home-hero-cta .cta-explicacion{display:none}
    .pb-restart-note{margin:10px 0 0;font-size:.84rem;color:#777c8d}.pb-restart-note button{appearance:none;border:0;background:transparent;color:#5c63cf;text-decoration:underline;text-underline-offset:3px;font-weight:800;cursor:pointer;padding:0}
    .pb-tramites-hidden{display:none!important}.pb-more-steps{display:inline-flex;margin:12px 0 4px;padding:10px 14px;border-radius:11px;border:1px solid #d4d7f3;background:#fff;color:#4e54c8;font-weight:850;cursor:pointer}
    @media(max-width:760px){.pb-focus-actions a,.pb-focus-actions button{width:100%;box-sizing:border-box}.pb-focus-box{padding:16px}.pb-home-more>summary{padding:14px 15px}}
  `;
  document.head.appendChild(css);

  function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){return {};}}
  function clearSavedJourney(){
    try {
      localStorage.removeItem(WORKSPACE_KEY);
      localStorage.removeItem(PROGRESS_KEY);
      sessionStorage.removeItem(CONTEXT_KEY);
    } catch (_) {}
  }

  function enhanceHome(){
    if (location.pathname !== '/' && location.pathname !== '') return;
    const needs = document.querySelector('.home-necesidades');
    const cards = needs ? [...needs.querySelectorAll('.home-necesidad-card')] : [];
    const title = document.getElementById('home-necesidades-titulo');
    if (title) title.textContent = 'Elige cómo quieres empezar';
    if (cards.length >= 3) {
      cards[0].href='/herramientas/que-me-falta/';
      cards[0].querySelector('span').textContent='🧭';
      cards[0].querySelector('strong').textContent='No sé por dónde empezar';
      cards[0].querySelector('small').textContent='Te decimos qué hacer ahora y qué puede esperar';
      cards[1].href='/herramientas/';
      cards[1].querySelector('span').textContent='⚡';
      cards[1].querySelector('strong').textContent='Quiero hacer un trámite';
      cards[1].querySelector('small').textContent='Preparadores inteligentes y herramientas paso a paso';
      cards[2].href='/ayudas-nacimiento/';
      cards[2].querySelector('span').textContent='💶';
      cards[2].querySelector('strong').textContent='Busco ayudas o dinero';
      cards[2].querySelector('small').textContent='Prestaciones, deducciones y ayudas de tu comunidad';
    }

    const workspace = readJson(WORKSPACE_KEY);
    const progress = Object.assign({}, readJson(PROGRESS_KEY), workspace.progress || {});
    const keys=['registro','seguridad-social','tarjeta-sanitaria','padron','prestacion','deduccion','ayudas'];
    const done=keys.filter(k=>progress[k]).length;
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
        const lastPath=workspace.last?.path && workspace.last.path!=='/mi-panel/' ? workspace.last.path : '/mi-panel/';
        cta.innerHTML=`<div class="pb-focus-actions" style="justify-content:center"><a class="cta-enlace" href="/mi-panel/">Continuar desde mi panel →</a><a class="secondary" href="${lastPath}">Volver a mi última herramienta</a></div><p class="pb-restart-note">¿Este progreso ya no te sirve? <button type="button" id="pb-start-over">Empezar de nuevo</button></p>`;
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
    const premium=document.querySelector('.home-premium-destacado');
    if ((ia||premium) && !(ia&&ia.closest('.pb-home-more'))) {
      const d=document.createElement('details'); d.className='pb-home-more';
      d.innerHTML='<summary>✨ Más ayuda si la necesitas</summary>';
      const anchor=ia||premium; anchor.parentNode.insertBefore(d,anchor);
      if (ia) d.appendChild(ia);
      if (premium) {
        premium.querySelector('.contenido-etiqueta') && (premium.querySelector('.contenido-etiqueta').textContent='PLAN PREMIUM · GRATIS TEMPORALMENTE');
        premium.querySelector('h2') && (premium.querySelector('h2').textContent='Todo ordenado en un único plan');
        premium.querySelector('p') && (premium.querySelector('p').textContent='Fechas, prioridades, documentos y ayudas reunidos en un plan personalizado. Sin pago durante esta fase.');
        const a=premium.querySelector('a'); if(a) a.textContent='Abrir Premium gratis →';
        d.appendChild(premium);
      }
    }
  }

  function enhanceTramites(){
    if (!location.pathname.startsWith('/tramites-bebe')) return;
    const hero=document.querySelector('.hero.seo-page');
    const firstContent=hero?.querySelector('.contenido-informativo');
    if (!hero || !firstContent || document.querySelector('.pb-focus-box')) return;
    const box=document.createElement('section');
    box.className='pb-focus-box';
    box.innerHTML='<span class="pb-kicker">QUÉ HACER AHORA</span><h2>No intentes resolver los 8 trámites a la vez</h2><p>Marca lo que ya tienes y te mostraremos una única siguiente acción. Si ya sabes qué necesitas, entra directamente en el preparador correspondiente.</p><div class="pb-focus-actions"><a href="/herramientas/que-me-falta/">Decirme qué hago ahora →</a><a class="secondary" href="/preparador-tarjeta-sanitaria/">Tarjeta sanitaria</a><a class="secondary" href="/pack-empadronamiento/">Empadronamiento</a></div>';
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

  function boot(){ enhanceHome(); enhanceTramites(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();