(() => {
  const tasks = document.getElementById('panelTasks');
  if (!tasks || window.__pbPanelValueV2) return;
  window.__pbPanelValueV2 = true;

  const meta = {
    registro: { title: 'Registro Civil', href: '/registro-civil-bebe/', label: 'Revisar guía', icon: '🧾' },
    'seguridad-social': { title: 'Seguridad Social', href: '/alta-bebe-seguridad-social/', label: 'Revisar alta', icon: '👶' },
    'tarjeta-sanitaria': { title: 'Tarjeta sanitaria', href: '/preparador-tarjeta-sanitaria/', label: 'Preparar trámite', icon: '🏥', smart: true },
    padron: { title: 'Empadronamiento', href: '/pack-empadronamiento/', label: 'Preparar trámite', icon: '🏠', smart: true },
    prestacion: { title: 'Prestación y permiso', href: '/herramientas/calculadora-permiso-nacimiento/', label: 'Calcular permiso', icon: '🗓️' },
    deduccion: { title: 'Deducciones', href: '/deduccion-maternidad/', label: 'Revisar deducción', icon: '💳' },
    ayudas: { title: 'Ayudas', href: '/herramientas/buscador-ayudas/', label: 'Simular ayudas', icon: '💶' }
  };

  const style = document.createElement('style');
  style.textContent = `
    .panel-task-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.panel-task-actions a{display:inline-flex;padding:7px 10px;border-radius:10px;background:#f0f1ff;color:#4e54c8;text-decoration:none;font-size:.82rem;font-weight:850;white-space:normal}.panel-task-actions a.smart{background:#6067e8;color:#fff}.panel-task.is-done{background:#f7fbf8;border-color:#cee6d7}.panel-task.is-next{border-color:#9ea4ff;box-shadow:0 0 0 2px rgba(96,103,232,.08)}.panel-status-pill{display:inline-flex;padding:3px 7px;margin-left:7px;border-radius:999px;font-size:.65rem;font-weight:900}.panel-status-pill.done{background:#eaf7ef;color:#17633f}.panel-status-pill.pending{background:#fff4dc;color:#775b18}.panel-next-v2{display:grid;gap:10px}.panel-next-v2 .panel-btn{width:max-content}.panel-next-copy{color:#676b7c;font-size:.92rem}@media(max-width:820px){.panel-task-actions a,.panel-next-v2 .panel-btn{width:100%;box-sizing:border-box;justify-content:center}}
  `;
  document.head.appendChild(style);

  const boxes = [...tasks.querySelectorAll('input[type="checkbox"][data-key]')];
  boxes.forEach(box => {
    const item = box.closest('.panel-task');
    const m = meta[box.dataset.key];
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

  function refresh() {
    const pending = boxes.filter(b => !b.checked);
    boxes.forEach(b => {
      const item = b.closest('.panel-task');
      const pill = item?.querySelector('.panel-status-pill');
      item?.classList.toggle('is-done', b.checked);
      item?.classList.remove('is-next');
      if (pill) {
        pill.textContent = b.checked ? 'REVISADO' : 'PENDIENTE';
        pill.className = 'panel-status-pill ' + (b.checked ? 'done' : 'pending');
      }
    });

    const next = document.getElementById('nextStep');
    if (!next) return;
    if (!pending.length) {
      next.innerHTML = '<div class="panel-next-v2"><strong>Has revisado los 7 bloques principales.</strong><span class="panel-next-copy">Ahora revisa resoluciones, ayudas locales y cualquier trámite que siga pendiente de confirmación.</span><a class="panel-btn" href="/observatorio/">Revisar oportunidades verificadas →</a></div>';
      return;
    }
    const first = pending[0];
    const m = meta[first.dataset.key];
    first.closest('.panel-task')?.classList.add('is-next');
    next.innerHTML = `<div class="panel-next-v2"><span class="panel-next-copy">Tu siguiente acción recomendada</span><strong>${m.icon} ${m.title}</strong><a class="panel-btn" href="${m.href}">${m.label} →</a></div>`;
  }

  boxes.forEach(b => b.addEventListener('change', () => setTimeout(refresh, 0)));
  document.getElementById('resetProgress')?.addEventListener('click', () => setTimeout(refresh, 0));
  refresh();
})();