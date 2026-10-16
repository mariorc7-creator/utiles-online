(() => {
  const list = document.getElementById('taskList');
  if (!list || window.__pbQmfValueV2) return;
  window.__pbQmfValueV2 = true;

  const meta = {
    registro: { title: 'Registro Civil', action: 'Revisar qué necesito', href: '/registro-civil-bebe/', icon: '🧾' },
    'seguridad-social': { title: 'Seguridad Social', action: 'Revisar alta del bebé', href: '/alta-bebe-seguridad-social/', icon: '👶' },
    'tarjeta-sanitaria': { title: 'Tarjeta sanitaria', action: 'Abrir Preparador Inteligente', href: '/preparador-tarjeta-sanitaria/', icon: '🏥', featured: true },
    padron: { title: 'Empadronamiento', action: 'Abrir Preparador Inteligente', href: '/pack-empadronamiento/', icon: '🏠', featured: true },
    prestacion: { title: 'Prestación y permiso', action: 'Calcular y revisar', href: '/herramientas/calculadora-permiso-nacimiento/', icon: '🗓️' },
    deduccion: { title: 'Deducciones', action: 'Revisar deducción', href: '/deduccion-maternidad/', icon: '💳' },
    ayudas: { title: 'Ayudas', action: 'Simular mis ayudas', href: '/herramientas/buscador-ayudas/', icon: '💶', featured: true }
  };

  const style = document.createElement('style');
  style.textContent = `
    .qmf-smart-summary{margin:18px 0 24px;padding:20px;border-radius:20px;border:1px solid #dfe2fb;background:linear-gradient(135deg,#fff,#f5f5ff)}
    .qmf-smart-top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap}.qmf-smart-kicker{font-size:.75rem;font-weight:900;letter-spacing:.05em;color:#565dd2}.qmf-smart-summary h2{margin:5px 0 5px;font-size:1.35rem}.qmf-smart-summary p{margin:0;color:#62667a}.qmf-smart-cta{display:inline-flex;align-items:center;justify-content:center;padding:11px 15px;border-radius:12px;background:#6067e8;color:#fff!important;text-decoration:none;font-weight:850}.qmf-smart-cta.secondary{background:#fff;color:#4f56c9!important;border:1px solid #d5d8f7}.qmf-smart-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.qmf-smart-actions a{font-size:.86rem;font-weight:800;padding:7px 10px;border-radius:10px;background:#f1f2ff;text-decoration:none;white-space:normal}.qmf-smart-actions a.primary{background:#6067e8;color:#fff}.qmf-state{display:inline-flex;margin-left:8px;padding:3px 7px;border-radius:999px;font-size:.68rem;font-weight:900;vertical-align:middle}.qmf-state.done{background:#eaf7ef;color:#17633f}.qmf-state.pending{background:#fff4dc;color:#775b18}.qmf-item.is-done{background:#f7fbf8;border-color:#cfe7d8}.qmf-item.is-next{border-color:#9fa5ff;box-shadow:0 0 0 2px rgba(96,103,232,.08)}
    @media(max-width:640px){.qmf-smart-cta{width:100%}.qmf-smart-actions a{width:100%;box-sizing:border-box;text-align:center}}
  `;
  document.head.appendChild(style);

  const progress = document.querySelector('.qmf-progress');
  const summary = document.createElement('section');
  summary.className = 'qmf-smart-summary';
  summary.setAttribute('aria-live', 'polite');
  summary.innerHTML = '<div class="qmf-smart-top"><div><span class="qmf-smart-kicker">TU RUTA AHORA</span><h2 id="qmfSmartTitle">Vamos a ordenar el siguiente paso</h2><p id="qmfSmartText"></p></div><a id="qmfSmartCta" class="qmf-smart-cta" href="/mi-panel/">Abrir mi panel</a></div>';
  progress.insertAdjacentElement('afterend', summary);

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
  if (oldPersonal) {
    oldPersonal.textContent = 'Ver mis ayudas y trámites';
    oldPersonal.setAttribute('href', '/checklist/');
  }

  function refresh() {
    const pending = boxes.filter(b => !b.checked);
    boxes.forEach(b => {
      const item = b.closest('.qmf-item');
      const badge = item?.querySelector('.qmf-state');
      item?.classList.toggle('is-done', b.checked);
      item?.classList.remove('is-next');
      if (badge) {
        badge.textContent = b.checked ? 'REVISADO' : 'PENDIENTE';
        badge.className = 'qmf-state ' + (b.checked ? 'done' : 'pending');
      }
    });
    const title = document.getElementById('qmfSmartTitle');
    const text = document.getElementById('qmfSmartText');
    const cta = document.getElementById('qmfSmartCta');
    if (!pending.length) {
      title.textContent = 'Los 7 bloques principales están revisados';
      text.textContent = 'Ahora conviene comprobar resoluciones, ayudas locales y que no haya ningún trámite pendiente de confirmación.';
      cta.href = '/mi-panel/';
      cta.textContent = 'Ver mi progreso completo →';
      return;
    }
    const next = pending[0];
    const m = meta[next.dataset.key];
    next.closest('.qmf-item')?.classList.add('is-next');
    title.textContent = 'Siguiente: ' + m.title;
    text.textContent = pending.length === 1 ? 'Solo te queda este bloque por revisar.' : `Te quedan ${pending.length} bloques. Empieza por este para mantener un orden práctico.`;
    cta.href = m.href;
    cta.textContent = m.icon + ' ' + m.action + ' →';
  }

  boxes.forEach(b => b.addEventListener('change', () => setTimeout(refresh, 0)));
  document.getElementById('resetBtn')?.addEventListener('click', () => setTimeout(refresh, 0));
  refresh();
})();