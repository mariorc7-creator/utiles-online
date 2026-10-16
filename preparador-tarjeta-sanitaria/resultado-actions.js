(() => {
  if (!location.pathname.startsWith('/api/preparar-tarjeta-sanitaria')) return;
  const params = new URLSearchParams(location.search);
  if (params.get('inss') !== 'nose') return;

  const status = document.querySelector('.ts-status.warn');
  const hero = document.querySelector('.ts-hero.result');
  const target = status?.parentElement || hero;
  if (!target || document.getElementById('pb-inss-check-box')) return;

  const box = document.createElement('div');
  box.id = 'pb-inss-check-box';
  box.style.cssText = 'margin-top:18px;padding:16px;border:1px solid #ddd7a4;border-radius:16px;background:#fffaf0';
  box.innerHTML = `
    <strong style="display:block;margin-bottom:6px;color:#4f3f10">Compruébalo ahora</strong>
    <p style="margin:0 0 12px;color:#6b5a25;line-height:1.5">Abre la comprobación oficial de la Seguridad Social. Cuando veas el resultado, vuelve aquí y marca si el derecho sanitario ya está reconocido.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a href="https://w6.seg-social.es/das/Inicio?ConsultarDerecho=Consultar+derecho+asistencia+sanitaria" target="_blank" rel="noopener" class="ts-btn ts-btn-primary">Comprobar en Seguridad Social ↗</a>
      <button type="button" class="ts-btn" id="pb-inss-yes">✓ Sí, está reconocido</button>
      <button type="button" class="ts-btn secondary" id="pb-inss-no">No, todavía no</button>
    </div>`;
  target.appendChild(box);

  function reloadWith(value) {
    const next = new URLSearchParams(location.search);
    next.set('inss', value);
    location.href = location.pathname + '?' + next.toString();
  }
  document.getElementById('pb-inss-yes')?.addEventListener('click', () => reloadWith('si'));
  document.getElementById('pb-inss-no')?.addEventListener('click', () => reloadWith('no'));
})();
