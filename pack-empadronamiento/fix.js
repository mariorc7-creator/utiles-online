(() => {
  const $ = (id) => document.getElementById(id);

  function safeText(id) {
    const el = $(id);
    return el && typeof el.value === 'string' && el.value.trim() ? el.value.trim() : '[pendiente]';
  }

  function buildSummary() {
    const output = $('output');
    if (!output) return;

    const convivencia = $('convivencia');
    const convivenciaTxt = convivencia && convivencia.selectedIndex >= 0
      ? convivencia.options[convivencia.selectedIndex].text
      : '[pendiente]';

    const checks = [...document.querySelectorAll('#checklist input[type="checkbox"]')];
    const hechas = checks.filter((x) => x.checked).map((x) => `✓ ${x.dataset.label || x.parentElement.textContent.trim()}`);
    const pendientes = checks.filter((x) => !x.checked).map((x) => `□ ${x.dataset.label || x.parentElement.textContent.trim()}`);

    output.textContent = [
      'MI PREPARACIÓN · EMPADRONAMIENTO DEL BEBÉ',
      '',
      'Municipio: Madrid',
      `Situación: ${convivenciaTxt}`,
      `Dirección: ${safeText('direccion')}`,
      `Bebé: ${safeText('bebename')}`,
      `Fecha de nacimiento: ${safeText('fecha')}`,
      `Progenitor/persona que presenta: ${safeText('adulto')}`,
      `Documento: ${safeText('docid')}`,
      '',
      'En la Hoja Padronal: marcar causa del alta → NACIMIENTO',
      '',
      'COMPLETADO',
      ...(hechas.length ? hechas : ['—']),
      '',
      'PENDIENTE',
      ...(pendientes.length ? pendientes : ['—']),
      '',
      'Documento oficial: Hoja Padronal del Ayuntamiento de Madrid',
      'Este resumen es una ayuda de preparación y no sustituye el formulario oficial.'
    ].join('\n');

    output.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearData() {
    ['direccion','bebename','fecha','adulto','docid'].forEach((id) => {
      const el = $(id);
      if (el) el.value = '';
    });
    document.querySelectorAll('#checklist input[type="checkbox"]').forEach((x) => { x.checked = false; });
    const output = $('output');
    if (output) output.textContent = 'Datos borrados. Completa los campos y genera de nuevo tu resumen.';
  }

  async function copySummary() {
    const output = $('output');
    const button = $('copiar');
    if (!output || !button) return;
    try {
      await navigator.clipboard.writeText(output.textContent);
      button.textContent = '✓ Copiado';
      setTimeout(() => { button.textContent = 'Copiar resumen'; }, 1500);
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(output);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Resumen seleccionado';
    }
  }

  function bind() {
    const generar = $('generar');
    const limpiar = $('limpiar');
    const copiar = $('copiar');
    if (generar) generar.onclick = buildSummary;
    if (limpiar) limpiar.onclick = clearData;
    if (copiar) copiar.onclick = copySummary;

    document.querySelectorAll('#checklist input[type="checkbox"]').forEach((x) => {
      x.onchange = () => {
        const output = $('output');
        if (output && output.textContent.startsWith('MI PREPARACIÓN')) buildSummary();
      };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
})();
