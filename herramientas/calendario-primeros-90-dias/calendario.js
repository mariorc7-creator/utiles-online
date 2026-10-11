document.addEventListener('DOMContentLoaded', function () {
  const boton = document.getElementById('generarCalendario');
  const fecha = document.getElementById('fecha');
  const resultado = document.getElementById('resultado');
  const timeline = document.getElementById('timeline');

  if (!boton || !fecha || !resultado || !timeline) return;

  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const dd = String(ahora.getDate()).padStart(2, '0');
  fecha.max = `${yyyy}-${mm}-${dd}`;

  function sumarDias(d, dias) {
    const x = new Date(d.getTime());
    x.setDate(x.getDate() + dias);
    return x;
  }

  function formatear(d) {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(d);
  }

  function item(titulo, fechaObjetivo, texto) {
    return '<div class="timeline-item">' +
      '<strong>' + titulo + ' · ' + formatear(fechaObjetivo) + '</strong>' +
      '<span>' + texto + '</span>' +
      '</div>';
  }

  function limpiarResultado() {
    resultado.className = 'tool-result';
    timeline.innerHTML = '';
  }

  function mostrarError(mensaje) {
    timeline.innerHTML = '<div class="timeline-item"><strong>' + mensaje + '</strong></div>';
    resultado.className = 'tool-result show tool-result-error';
  }

  function generar() {
    const valorFecha = fecha.value;

    if (!valorFecha) {
      mostrarError('Introduce la fecha de nacimiento.');
      fecha.focus();
      return;
    }

    const nacimiento = new Date(valorFecha + 'T12:00:00');
    if (Number.isNaN(nacimiento.getTime())) {
      mostrarError('La fecha introducida no es válida.');
      fecha.focus();
      return;
    }

    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    if (nacimiento > hoy) {
      mostrarError('La fecha de nacimiento no puede ser futura.');
      fecha.focus();
      return;
    }

    timeline.innerHTML =
      item('Primeros días', sumarDias(nacimiento, 2), 'Revisa inscripción/Registro Civil, alta del bebé en Seguridad Social y tarjeta sanitaria según tu situación.') +
      item('Primera semana', sumarDias(nacimiento, 7), 'Comprueba que tienes identificados los trámites pendientes y guarda justificantes y resoluciones.') +
      item('Primer mes', sumarDias(nacimiento, 30), 'Revisa ayudas estatales, autonómicas y municipales y comprueba si alguna convocatoria tiene plazo propio.') +
      item('Dos meses', sumarDias(nacimiento, 60), 'Comprueba el estado de solicitudes, posibles requerimientos y deducciones fiscales aplicables.') +
      item('90 días', sumarDias(nacimiento, 90), 'Haz una revisión final de expedientes abiertos y actualiza tus ayudas y trámites pendientes.');

    resultado.className = 'tool-result show';
    resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  boton.addEventListener('click', generar);
  fecha.addEventListener('input', limpiarResultado);
  fecha.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      generar();
    }
  });
});
