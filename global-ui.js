(() => {
  const OBSERVATORIO_HREF = '/observatorio/';

  function asegurarObservatorioEnNavegacion() {
    document.querySelectorAll('.nav-principal').forEach((nav) => {
      let enlace = nav.querySelector('a[href="/observatorio/"], a[href="https://www.papelesdelbebe.es/observatorio/"]');
      if (!enlace) {
        enlace = document.createElement('a');
        enlace.href = OBSERVATORIO_HREF;
        enlace.textContent = 'Observatorio';
        enlace.className = 'nav-observatorio';

        const premium = nav.querySelector('a[href="/premium/"], .nav-premium');
        if (premium) nav.insertBefore(enlace, premium);
        else nav.appendChild(enlace);
      }

      if (location.pathname.startsWith('/observatorio/')) {
        enlace.setAttribute('aria-current', 'page');
      }
    });
  }

  function asegurarObservatorioEnHome() {
    if (location.pathname !== '/' && location.pathname !== '/index.html') return;

    const grid = document.querySelector('.home-necesidades-grid');
    if (grid && !grid.querySelector('a[href="/observatorio/"]')) {
      const card = document.createElement('a');
      card.href = '/observatorio/';
      card.className = 'home-necesidad-card home-necesidad-observatorio';
      card.innerHTML = `
        <span class="home-necesidad-icono">📊</span>
        <div>
          <strong>Observatorio</strong>
          <small>Alertas de oportunidad, comparativas y ayudas que no conviene dejar pasar</small>
        </div>
        <b aria-hidden="true">→</b>`;
      grid.appendChild(card);
    }
  }

  function actualizarPremiumGratis() {
    const home = document.querySelector('.home-premium-destacado');
    if (home) {
      const etiqueta = home.querySelector('.contenido-etiqueta');
      const texto = home.querySelector('.home-papelesia-copy p');
      const cta = home.querySelector('a[href="/premium/"]');
      if (etiqueta) etiqueta.textContent = 'PLAN PREMIUM · GRATIS TEMPORALMENTE';
      if (texto) texto.textContent = 'Fechas, prioridades, documentos y ayudas reunidos en un plan personalizado. Gratis temporalmente y sin tarjeta.';
      if (cta) cta.textContent = 'Abrir Premium gratis →';
    }

    document.querySelectorAll('.cta-premium-secundario, .upsell-premium').forEach((bloque) => {
      const enlace = bloque.querySelector('a[href="/premium/"]');
      if (enlace && /9[,.]90|pago/i.test(enlace.textContent)) {
        enlace.textContent = 'Ver Premium gratis temporalmente →';
      }

      bloque.querySelectorAll('p, small, span').forEach((nodo) => {
        if (/9[,.]90\s*€|pago único/i.test(nodo.textContent || '')) {
          nodo.textContent = (nodo.textContent || '')
            .replace(/9[,.]90\s*€/gi, 'gratis temporalmente')
            .replace(/pago único\.?/gi, 'sin tarjeta');
        }
      });
    });
  }

  function aplicar() {
    asegurarObservatorioEnNavegacion();
    asegurarObservatorioEnHome();
    actualizarPremiumGratis();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicar, { once: true });
  } else {
    aplicar();
  }

  let pendiente = false;
  const iniciarObserver = () => {
    if (!document.body) return;
    const observer = new MutationObserver(() => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        aplicar();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarObserver, { once: true });
  } else {
    iniciarObserver();
  }
})();
