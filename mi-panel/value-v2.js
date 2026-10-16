(() => {
  const tasks = document.getElementById('panelTasks');
  if (!tasks || window.__pbPanelValueV2) return;
  window.__pbPanelValueV2 = true;

  const meta = {
    registro: { title: 'Registro Civil', href: '/registro-civil-bebe/', label: 'Revisar guía', icon: '🧾', why:'Asegura la inscripción y la documentación base.' },
    'seguridad-social': { title: 'Seguridad Social', href: '/alta-bebe-seguridad-social/', label: 'Revisar alta', icon: '👶', why:'Comprueba que el bebé figura correctamente para continuar con salud.' },
    'tarjeta-sanitaria': { title: 'Tarjeta sanitaria', href: '/preparador-tarjeta-sanitaria/', label: 'Preparar trámite', icon: '🏥', smart: true, why:'Ruta personalizada según tu situación y comunidad.' },
    padron: { title: 'Empadronamiento', href: '/pack-empadronamiento/', label: 'Preparar trámite', icon: '🏠', smart: true, why:'Prepara padrón y documentación antes de entrar en la sede municipal.' },
    prestacion: { title: 'Prestación y permiso', href: '/herramientas/calculadora-permiso-nacimiento/', label: 'Calcular permiso', icon: '🗓️', why:'Aclara el permiso y enlaza la revisión de la prestación.' },
    deduccion: { title: 'Deducciones', href: '/deduccion-maternidad/', label: 'Revisar deducción', icon: '💳', why:'Revisa fiscalidad familiar antes de darla por cerrada.' },
    ayudas: { title: 'Ayudas', href: '/herramientas/buscador-ayudas/', label: 'Simular ayudas', icon: '💶', why:'Detecta ayudas estatales y territoriales que merece la pena revisar.' }
  };

  const style = document.createElement('style');
  style.textContent = `
    .panel-task-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.panel-task-actions a{display:inline-flex;padding:7px 10px;border-radius:10px;background:#f0f1ff;color:#4e54c8;text-decoration:none;font-size:.82rem;font-weight:850;white-space:normal}.panel-task-actions a.smart{background:#6067e8;color:#fff}.panel-task.is-done{background:#f7fbf8;border-color:#cee6d7}.panel-task.is-next{border-color:#9ea4ff;box-shadow:0 0 0 2px rgba(96,103,232,.08)}.panel-status-pill{display:inline-flex;padding:3px 7px;margin-left:7px;border-radius:999px;font-size:.65rem;font-weight:900}.panel-status-pill.done{background:#eaf7ef;color:#17633f}.panel-status-pill.pending{background:#fff4dc;color:#775b18}.panel-next-v2{display:grid;gap:10px}.panel-next-v2 .panel-btn{width:max-content}.panel-next-copy{color:#676b7c;font-size:.92rem}
    .panel-today{margin:0 0 18px;padding:18px;border:1px solid #e3e5f3;border-radius:20px;background:linear-gradient(135deg,#fbfbff,#fff)}.panel-today-head{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.panel-today h2{margin:4px 0}.panel-today-list{display:grid;gap:9px;margin-top:12px}.panel-today-row{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:11px;border:1px solid #e9eaf2;border-radius:13px;background:#fff}.panel-today-row .step{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#eef0ff;color:#4e54c8;font-weight:900}.panel-today-row small{display:block;color:#737789;margin-top:2px}.panel-today-row a{font-size:.82rem;font-weight:850;text-decoration:none}.panel-share{display:flex;gap:8px;flex-wrap:wrap}.panel-share-feedback{font-size:.8rem;color:#287248;font-weight:800;min-height:1em}.panel-smart-shortcuts{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.panel-smart-shortcuts a{display:block;padding:12px;border-radius:13px;background:#6067e8;color:#fff;text-decoration:none;font-weight:850}.panel-smart-shortcuts span{display:block;font-size:.78rem;opacity:.88;margin-top:3px;font-weight:600}
    @media(max-width:820px){.panel-task-actions a,.panel-next-v2 .panel-btn{width:100%;box-sizing:border-box;justify-content:center}.panel-today-row{grid-template-columns:auto 1fr}.panel-today-row a{grid-column:2}.panel-smart-shortcuts{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const boxes = [...tasks.querySelectorAll('input[type="checkbox"][data-key]')];
  boxes.forEach(box => {
    const item = box.closest('.panel-task'), m = meta[box.dataset.key];
    if (!item || !m) return;
    const h3 = item.querySelector('h3');
    if (h3 && !h3.querySelector('.panel-status-pill')) h3.insertAdjacentHTML('beforeend','<span class="panel-status-pill pending">PENDIENTE</span>');
    const content = item.querySelector('div');
    if (content && !content.querySelector('.panel-task-actions')) {
      const a = document.createElement('div');
      a.className = 'panel-task-actions';
      a.innerHTML = `<a class="${m.smart ? 'smart' : ''}" href="${m.href}">${m.icon} ${m.label} →</a>`;
      content.appendChild(a);
    }
  });

  const mainCard = tasks.closest('.panel-card');
  if (mainCard && !document.getElementById('panelToday')) {
    const block=document.createElement('section');
    block.id='panelToday';block.className='panel-today';
    block.innerHTML='<div class="panel-today-head"><div><span class="tool-kicker">RUTA DE HOY</span><h2>Tu plan en 3 movimientos</h2><p style="margin:0;color:#6c7080">Solo mostramos lo que merece tu atención ahora.</p></div><div class="panel-share"><button id="panelShareBtn" class="panel-btn secondary" type="button">Compartir con pareja</button><div id="panelShareFeedback" class="panel-share-feedback" aria-live="polite"></div></div></div><div id="panelTodayList" class="panel-today-list"></div>';
    mainCard.insertBefore(block, tasks);
  }

  const aside=document.querySelector('.panel-grid aside.panel-card');
  if(aside && !document.getElementById('panelSmartShortcuts')){
    const wrap=document.createElement('div');wrap.id='panelSmartShortcuts';wrap.innerHTML='<h2 style="margin-top:24px">Preparadores inteligentes</h2><div class="panel-smart-shortcuts"><a href="/preparador-tarjeta-sanitaria/">🏥 Tarjeta sanitaria<span>Detecta bloqueos y siguiente paso.</span></a><a href="/pack-empadronamiento/">🏠 Empadronamiento<span>Prepara la gestión municipal.</span></a></div>';
    aside.appendChild(wrap);
  }

  function shareText(){
    const done=boxes.filter(b=>b.checked).length;
    const pending=boxes.filter(b=>!b.checked).slice(0,3).map(b=>meta[b.dataset.key].title);
    return `Papeleo del bebé: ${done}/${boxes.length} bloques revisados.${pending.length?' Próximos: '+pending.join(', ')+'.':' Bloques principales revisados.'}\nSeguimos aquí: https://www.papelesdelbebe.es/mi-panel/`;
  }
  document.getElementById('panelShareBtn')?.addEventListener('click',async()=>{
    const text=shareText(),feedback=document.getElementById('panelShareFeedback');
    try{if(navigator.share)await navigator.share({title:'Nuestro panel de trámites del bebé',text});else{await navigator.clipboard.writeText(text);feedback.textContent='Resumen copiado ✓';setTimeout(()=>feedback.textContent='',2500);}}catch(e){}
  });

  function refresh() {
    const pending = boxes.filter(b => !b.checked);
    boxes.forEach(b => {
      const item = b.closest('.panel-task'), pill = item?.querySelector('.panel-status-pill');
      item?.classList.toggle('is-done', b.checked); item?.classList.remove('is-next');
      if (pill) { pill.textContent = b.checked ? 'REVISADO' : 'PENDIENTE'; pill.className = 'panel-status-pill ' + (b.checked ? 'done' : 'pending'); }
    });

    const next = document.getElementById('nextStep'), today=document.getElementById('panelTodayList');
    if (!next || !today) return;
    if (!pending.length) {
      next.innerHTML = '<div class="panel-next-v2"><strong>Has revisado los 7 bloques principales.</strong><span class="panel-next-copy">Ahora revisa resoluciones, ayudas locales y cualquier trámite que siga pendiente de confirmación.</span><a class="panel-btn" href="/observatorio/">Revisar oportunidades verificadas →</a></div>';
      today.innerHTML='<div class="panel-today-row"><span class="step">✓</span><div><strong>Bloques principales revisados</strong><small>Último paso: comprobar novedades y ayudas locales.</small></div><a href="/observatorio/">Abrir Observatorio →</a></div>';
      return;
    }
    const first = pending[0], m = meta[first.dataset.key];
    first.closest('.panel-task')?.classList.add('is-next');
    next.innerHTML = `<div class="panel-next-v2"><span class="panel-next-copy">Tu siguiente acción recomendada</span><strong>${m.icon} ${m.title}</strong><span class="panel-next-copy">${m.why}</span><a class="panel-btn" href="${m.href}">${m.label} →</a></div>`;
    today.innerHTML=pending.slice(0,3).map((b,i)=>{const x=meta[b.dataset.key];return `<div class="panel-today-row"><span class="step">${i+1}</span><div><strong>${x.icon} ${x.title}</strong><small>${x.why}</small></div><a href="${x.href}">${x.label} →</a></div>`;}).join('');
  }

  boxes.forEach(b => b.addEventListener('change', () => setTimeout(refresh, 0)));
  document.getElementById('resetProgress')?.addEventListener('click', () => setTimeout(refresh, 0));
  refresh();
})();