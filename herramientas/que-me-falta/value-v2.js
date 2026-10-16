(() => {
  const list = document.getElementById('taskList');
  if (!list || window.__pbQmfValueV2) return;
  window.__pbQmfValueV2 = true;

  const meta = {
    registro: { title: 'Registro Civil', action: 'Revisar qué necesito', href: '/registro-civil-bebe/', icon: '🧾', why:'Deja la inscripción y documentación base revisadas.' },
    'seguridad-social': { title: 'Seguridad Social', action: 'Revisar alta del bebé', href: '/alta-bebe-seguridad-social/', icon: '👶', why:'Suele ser un paso previo importante para el circuito sanitario.' },
    'tarjeta-sanitaria': { title: 'Tarjeta sanitaria', action: 'Abrir Preparador Inteligente', href: '/preparador-tarjeta-sanitaria/', icon: '🏥', featured: true, why:'Te lleva a la ruta sanitaria según tu situación y comunidad.' },
    padron: { title: 'Empadronamiento', action: 'Abrir Preparador Inteligente', href: '/pack-empadronamiento/', icon: '🏠', featured: true, why:'Te ayuda a preparar padrón, documentación y vía municipal.' },
    prestacion: { title: 'Prestación y permiso', action: 'Calcular y revisar', href: '/herramientas/calculadora-permiso-nacimiento/', icon: '🗓️', why:'Ordena semanas y te lleva a la revisión de la prestación.' },
    deduccion: { title: 'Deducciones', action: 'Revisar deducción', href: '/deduccion-maternidad/', icon: '💳', why:'Evita dejar para después una posible ventaja fiscal.' },
    ayudas: { title: 'Ayudas', action: 'Simular mis ayudas', href: '/herramientas/buscador-ayudas/', icon: '💶', featured: true, why:'Filtra ayudas que merece la pena comprobar en tu caso.' }
  };

  const style = document.createElement('style');
  style.textContent = `
    .qmf-smart-summary{margin:18px 0 16px;padding:20px;border-radius:20px;border:1px solid #dfe2fb;background:linear-gradient(135deg,#fff,#f5f5ff)}
    .qmf-smart-top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap}.qmf-smart-kicker{font-size:.75rem;font-weight:900;letter-spacing:.05em;color:#565dd2}.qmf-smart-summary h2{margin:5px 0 5px;font-size:1.35rem}.qmf-smart-summary p{margin:0;color:#62667a}.qmf-smart-cta{display:inline-flex;align-items:center;justify-content:center;padding:11px 15px;border-radius:12px;background:#6067e8;color:#fff!important;text-decoration:none;font-weight:850;border:0;cursor:pointer}.qmf-smart-cta.secondary{background:#fff;color:#4f56c9!important;border:1px solid #d5d8f7}.qmf-smart-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.qmf-smart-actions a{font-size:.86rem;font-weight:800;padding:7px 10px;border-radius:10px;background:#f1f2ff;text-decoration:none;white-space:normal}.qmf-smart-actions a.primary{background:#6067e8;color:#fff}.qmf-state{display:inline-flex;margin-left:8px;padding:3px 7px;border-radius:999px;font-size:.68rem;font-weight:900;vertical-align:middle}.qmf-state.done{background:#eaf7ef;color:#17633f}.qmf-state.pending{background:#fff4dc;color:#775b18}.qmf-item.is-done{background:#f7fbf8;border-color:#cfe7d8}.qmf-item.is-next{border-color:#9fa5ff;box-shadow:0 0 0 2px rgba(96,103,232,.08)}
    .qmf-today{margin:0 0 24px;padding:20px;border:1px solid #e4e5ef;border-radius:20px;background:#fff}.qmf-today-head{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.qmf-today h2{margin:4px 0}.qmf-today-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.qmf-today-card{padding:14px;border:1px solid #e8e9f2;border-radius:15px;background:#fafaff}.qmf-today-card span{font-size:.7rem;font-weight:900;color:#5d63cc}.qmf-today-card strong{display:block;margin:5px 0}.qmf-today-card p{font-size:.86rem;color:#6a6f80;margin:0 0 10px;line-height:1.4}.qmf-today-card a{font-size:.82rem;font-weight:850;text-decoration:none}.qmf-share-feedback{font-size:.82rem;color:#287248;font-weight:800;min-height:1.1em}
    @media(max-width:760px){.qmf-today-list{grid-template-columns:1fr}}@media(max-width:640px){.qmf-smart-cta{width:100%}.qmf-smart-actions a{width:100%;box-sizing:border-box;text-align:center}}
  `;
  document.head.appendChild(style);

  const progress = document.querySelector('.qmf-progress');
  const summary = document.createElement('section');
  summary.className = 'qmf-smart-summary';
  summary.setAttribute('aria-live', 'polite');
  summary.innerHTML = '<div class="qmf-smart-top"><div><span class="qmf-smart-kicker">TU RUTA AHORA</span><h2 id="qmfSmartTitle">Vamos a ordenar el siguiente paso</h2><p id="qmfSmartText"></p></div><a id="qmfSmartCta" class="qmf-smart-cta" href="/mi-panel/">Abrir mi panel</a></div>';
  progress.insertAdjacentElement('afterend', summary);

  const today = document.createElement('section');
  today.className = 'qmf-today';
  today.innerHTML = '<div class="qmf-today-head"><div><span class="qmf-smart-kicker">PLAN DE HOY</span><h2>Haz solo lo siguiente</h2><p style="margin:0;color:#686d7d">Tres acciones como máximo para que el papeleo no se convierta en otra lista infinita.</p></div><div><button type="button" id="qmfShare" class="qmf-smart-cta secondary">Compartir progreso</button><div id="qmfShareFeedback" class="qmf-share-feedback" aria-live="polite"></div></div></div><div id="qmfTodayList" class="qmf-today-list"></div>';
  summary.insertAdjacentElement('afterend', today);

  const boxes = [...list.querySelectorAll('input[type="checkbox"][data-key]')];
  boxes.forEach(box => {
    const item = box.closest('.qmf-item');
    const key = box.dataset.key;
    const m = meta[key];
    if (!item || !m) return;
    const h2 = item.querySelector('h2');
    if (h2 && !h2.querySelector('.qmf-state')) h2.insertAdjacentHTML('beforeend', '<span class="qmf-state pending">PENDIENTE</span>');
    const text = item.querySelector('div');
    if (text && !text.querySelector('.qmf-smart-actions')) {
      const actions = document.createElement('div');
      actions.className = 'qmf-smart-actions';
      actions.innerHTML = `<a class="${m.featured ? 'primary' : ''}" href="${m.href}">${m.icon} ${m.action} →</a>`;
      text.appendChild(actions);
    }
  });

  const oldPersonal = document.querySelector('.qmf-results .qmf-actions a[href="/checklist/"]');
  if (oldPersonal) oldPersonal.textContent = 'Ver mis ayudas y trámites';

  function shareText() {
    const done = boxes.filter(b => b.checked).length;
    const pending = boxes.filter(b => !b.checked).slice(0,3).map(b => meta[b.dataset.key].title);
    return `Nuestro papeleo del bebé: ${done}/${boxes.length} bloques revisados.${pending.length ? ' Próximos: ' + pending.join(', ') + '.' : ' Bloques principales revisados.'}\nPapeles del Bebé: https://www.papelesdelbebe.es/herramientas/que-me-falta/`;
  }
  async function shareProgress(){
    const text=shareText(), feedback=document.getElementById('qmfShareFeedback');
    try{
      if(navigator.share) await navigator.share({title:'Nuestro progreso de trámites del bebé',text});
      else {await navigator.clipboard.writeText(text);feedback.textContent='Resumen copiado ✓';setTimeout(()=>feedback.textContent='',2500);}
    }catch(e){}
  }
  document.getElementById('qmfShare')?.addEventListener('click',shareProgress);

  function refresh() {
    const pending = boxes.filter(b => !b.checked);
    boxes.forEach(b => {
      const item = b.closest('.qmf-item');
      const badge = item?.querySelector('.qmf-state');
      item?.classList.toggle('is-done', b.checked);
      item?.classList.remove('is-next');
      if (badge) { badge.textContent = b.checked ? 'REVISADO' : 'PENDIENTE'; badge.className = 'qmf-state ' + (b.checked ? 'done' : 'pending'); }
    });
    const title = document.getElementById('qmfSmartTitle');
    const text = document.getElementById('qmfSmartText');
    const cta = document.getElementById('qmfSmartCta');
    const todayList = document.getElementById('qmfTodayList');
    if (!pending.length) {
      title.textContent = 'Los 7 bloques principales están revisados';
      text.textContent = 'Ahora conviene comprobar resoluciones, ayudas locales y que no haya ningún trámite pendiente de confirmación.';
      cta.href = '/mi-panel/'; cta.textContent = 'Ver mi progreso completo →';
      todayList.innerHTML='<div class="qmf-today-card"><span>ÚLTIMA REVISIÓN</span><strong>🔎 Busca oportunidades que se escapan</strong><p>Ayudas locales, convocatorias nuevas o cambios territoriales.</p><a href="/observatorio/">Abrir Observatorio →</a></div>';
      return;
    }
    const next = pending[0], m = meta[next.dataset.key];
    next.closest('.qmf-item')?.classList.add('is-next');
    title.textContent = 'Siguiente: ' + m.title;
    text.textContent = pending.length === 1 ? 'Solo te queda este bloque por revisar.' : `Te quedan ${pending.length} bloques. Nosotros te reducimos la decisión al siguiente paso.`;
    cta.href = m.href; cta.textContent = m.icon + ' ' + m.action + ' →';
    todayList.innerHTML=pending.slice(0,3).map((b,i)=>{const x=meta[b.dataset.key];return `<article class="qmf-today-card"><span>${i===0?'HAZ AHORA':i===1?'DESPUÉS':'SI TE QUEDA TIEMPO'}</span><strong>${x.icon} ${x.title}</strong><p>${x.why}</p><a href="${x.href}">${x.action} →</a></article>`;}).join('');
  }

  boxes.forEach(b => b.addEventListener('change', () => setTimeout(refresh, 0)));
  document.getElementById('resetBtn')?.addEventListener('click', () => setTimeout(refresh, 0));
  refresh();
})();