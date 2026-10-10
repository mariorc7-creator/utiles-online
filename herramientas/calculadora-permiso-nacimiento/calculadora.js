document.addEventListener('DOMContentLoaded', function () {
  const boton = document.getElementById('calcularPermiso');
  const tipo = document.getElementById('tipo');
  const fecha = document.getElementById('fecha');
  const resultado = document.getElementById('resultado');

  if (!boton || !tipo || !fecha || !resultado) return;

  function formatear(d) {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(d);
  }

  function sumarSemanas(d, semanas) {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() + semanas * 7);
    return x;
  }

  function sumarAnios(d, anios) {
    const x = new Date(d.getTime());
    x.setFullYear(x.getFullYear() + anios);
    return x;
  }

  function mostrarError(mensaje) {
    resultado.className = 'tool-result show tool-result-error';
    resultado.innerHTML = '<strong>' + mensaje + '</strong>';
  }

  boton.addEventListener('click', function () {
    const valorFecha = fecha.value;

    if (!valorFecha) {
      mostrarError('Introduce una fecha de nacimiento o hecho causante.');
      fecha.focus();
      return;
    }

    const nacimiento = new Date(valorFecha + 'T12:00:00');
    if (Number.isNaN(nacimiento.getTime())) {
      mostrarError('La fecha introducida no es válida.');
      return;
    }

    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (nacimiento > hoy) {
      mostrarError('La fecha no puede ser futura.');
      return;
    }

    const monoparental = tipo.value === 'mono';
    const total = monoparental ? 32 : 19;
    const obligatorias = 6;
    const hasta12m = monoparental ? 22 : 11;
    const hasta8a = monoparental ? 4 : 2;

    const finObligatorias = sumarSemanas(nacimiento, obligatorias);
    const limite12m = sumarAnios(nacimiento, 1);
    const limite8a = sumarAnios(nacimiento, 8);

    resultado.className = 'tool-result show';
    resultado.innerHTML =
      '<strong class="big">' + total + ' semanas</strong>' +
      '<p><b>' + obligatorias + ' semanas obligatorias</b> e ininterrumpidas desde el hecho causante. Fin orientativo: ' + formatear(finObligatorias) + '.</p>' +
      '<p><b>' + hasta12m + ' semanas</b> pueden distribuirse por semanas hasta que el menor cumpla 12 meses: ' + formatear(limite12m) + '.</p>' +
      '<p><b>' + hasta8a + ' semanas</b> adicionales pueden disfrutarse por semanas hasta los 8 años: ' + formatear(limite8a) + '.</p>';

    resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
