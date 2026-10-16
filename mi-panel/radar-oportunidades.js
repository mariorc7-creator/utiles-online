(() => {
  if (window.__pbRadarOportunidades) return;
  window.__pbRadarOportunidades = true;
  const host=document.querySelector('.panel-grid .panel-card');
  if(!host) return;
  const PROGRESS='papelesbebe_que_me_falta_v1', WORKSPACE='papelesbebe_workspace_v1', CONTEXT='papelesbebe_shared_context_v1';
  function read(storage,key){try{return JSON.parse(storage.getItem(key)||'{}')||{};}catch(_){return {};}}
  function progress(){const w=read(localStorage,WORKSPACE);return Object.assign({},read(localStorage,PROGRESS),w.progress||{});}
  function context(){const w=read(localStorage,WORKSPACE);const c=read(sessionStorage,CONTEXT);const tool=(w.tools&&w.tools['/herramientas/buscador-ayudas/']&&w.tools['/herramientas/buscador-ayudas/'].fields)||{};return Object.assign({},tool,c);}
  const style=document.createElement('style');style.textContent=`.pb-radar{margin:18px 0;padding:20px;border:1px solid #e2e5f2;border-radius:22px;background:linear-gradient(135deg,#fffdf8,#fff);box-shadow:0 8px 24px rgba(49,52,95,.04)}.pb-radar-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}.pb-radar h2{margin:4px 0 4px}.pb-radar p{margin:0;color:#6c7080}.pb-radar-list{display:grid;gap:9px;margin-top:14px}.pb-radar-item{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;padding:12px 13px;border:1px solid #e8e9f1;border-radius:14px;background:#fff}.pb-radar-item .icon{font-size:1.25rem}.pb-radar-item strong{display:block}.pb-radar-item small{display:block;color:#6f7382;margin-top:2px;line-height:1.35}.pb-radar-item a{font-weight:850;text-decoration:none;white-space:nowrap}.pb-radar-pill{padding:5px 8px;border-radius:999px;background:#fff3d8;color:#775b18;font-size:.7rem;font-weight:900}@media(max-width:760px){.pb-radar-item{grid-template-columns:auto 1fr}.pb-radar-item a{grid-column:2;white-space:normal}}`;
  document.head.appendChild(style);
  const block=document.createElement('section');block.className='pb-radar';block.id='radar-no-se-te-escape';
  const docs=document.getElementById('mi-carpeta-bebe');
  (docs||document.getElementById('panelToday')||host.firstElementChild).insertAdjacentElement('afterend',block);
  function render(){const p=progress(),c=context(),items=[];
    if(!p.ayudas) items.push({i:'💶',t:'Revisar ayudas que podrían encajar',d:'Todavía no has cerrado el bloque de ayudas. Empieza por el simulador y valida después cada resultado en la fuente oficial.',h:'/herramientas/buscador-ayudas/',a:'Simular ayudas'});
    if(!p.deduccion) items.push({i:'💳',t:'No olvides la fiscalidad familiar',d:'La deducción por maternidad y, cuando proceda, los gastos de guardería se revisan aparte de otras ayudas.',h:'/deduccion-maternidad/',a:'Revisar deducciones'});
    if(c.familia==='monoparental'||c.family==='monoparental') items.unshift({i:'👤',t:'Tienes una ruta específica para familia monoparental',d:'Hay permisos y apoyos que requieren revisar el supuesto concreto y el territorio.',h:'/familias-monoparentales-ayudas-2026/',a:'Abrir guía'});
    if(c.familia==='numerosa'||c.family==='numerosa') items.unshift({i:'👨‍👩‍👧‍👦',t:'Revisa beneficios de familia numerosa',d:'Comprueba título, deducciones y prestaciones aplicables a tu situación.',h:'/familias-numerosas-ayudas-2026/',a:'Abrir guía'});
    if(!p['tarjeta-sanitaria']) items.push({i:'🏥',t:'Tarjeta sanitaria todavía pendiente',d:'El preparador puede detectar qué comprobación te falta antes de entrar en la sede sanitaria.',h:'/preparador-tarjeta-sanitaria/',a:'Preparar trámite'});
    if(!p.padron) items.push({i:'🏠',t:'Empadronamiento todavía pendiente',d:'Dejar el padrón encaminado puede facilitar gestiones territoriales posteriores.',h:'/pack-empadronamiento/',a:'Preparar padrón'});
    const visible=items.slice(0,3);
    block.innerHTML=`<div class="pb-radar-head"><div><span class="tool-kicker">RADAR · NO SE TE ESCAPE</span><h2>${visible.length?'Hay '+visible.length+' cosas que merece la pena revisar':'No vemos pendientes destacados ahora'}</h2><p>Son avisos de revisión basados en tu progreso, no una confirmación oficial de que te corresponda una ayuda.</p></div><span class="pb-radar-pill">${visible.length?'REVISAR':'AL DÍA'}</span></div><div class="pb-radar-list">${visible.map(x=>`<div class="pb-radar-item"><span class="icon">${x.i}</span><div><strong>${x.t}</strong><small>${x.d}</small></div><a href="${x.h}">${x.a} →</a></div>`).join('')}</div>`;
  }
  render();
  document.addEventListener('change',e=>{if(e.target.matches('[data-key],input[type=checkbox]'))setTimeout(render,0);});
})();