(() => {
  const $ = (id) => document.getElementById(id);

  function enforceCapitalesOnly() {
    const sel = $('municipio');
    if (!sel) return;

    [...sel.options].forEach((opt) => {
      if (opt.value === 'otro') opt.remove();
    });

    const libre = $('municipioLibre');
    if (libre) libre.remove();

    const label = sel.closest('.field')?.querySelector('label[for="municipio"]');
    if (label) label.textContent = 'Capital de provincia / ciudad autónoma';

    if (!sel.value && sel.options.length === 2) sel.selectedIndex = 1;
  }

  function updateCoverageCopy() {
    const notes = document.querySelectorAll('.pb-universal-note');
    notes.forEach((note) => {
      if (/Cobertura nacional activa/i.test(note.textContent || '')) {
        note.innerHTML = '<strong>Cobertura por capitales activa.</strong><br>El Preparador Inteligente incluye las capitales de provincia y Ceuta/Melilla. La revisión PDF solo aparece cuando hemos verificado un formulario oficial rellenable compatible.';
      }
    });

    const hero = document.querySelector('.pack .hero p');
    if (hero) {
      hero.innerHTML = 'No te pedimos nombre, DNI ni dirección. Solo las respuestas que cambian el trámite. Elige tu comunidad y su <strong>capital de provincia</strong> para ver qué revisar y cuál es la vía oficial. Si existe un PDF oficial rellenable verificado, también podrás revisarlo antes de presentar.';
    }
  }

  function sync() {
    enforceCapitalesOnly();
    updateCoverageCopy();
  }

  function init() {
    sync();
    $('comunidadMunicipal')?.addEventListener('change', () => setTimeout(sync, 0));
    $('municipio')?.addEventListener('change', () => setTimeout(updateCoverageCopy, 0));
    $('resolver')?.addEventListener('click', () => setTimeout(updateCoverageCopy, 0));

    const observer = new MutationObserver(() => sync());
    const municipio = $('municipio');
    if (municipio) observer.observe(municipio, { childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
