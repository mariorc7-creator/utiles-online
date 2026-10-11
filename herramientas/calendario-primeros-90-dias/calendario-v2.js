(function () {
  function init() {
    var boton = document.getElementById('generarCalendario');
    var fecha = document.getElementById('fecha');
    var resultado = document.getElementById('resultado');
    var timeline = document.getElementById('timeline');
    if (!boton || !fecha || !resultado || !timeline) return;

    var ahora = new Date();
    var yyyy = ahora.getFullYear();
    var mm = String(ahora.getMonth() + 1).padStart(2, '0');
    var dd = String(ahora.getDate()).padStart(2, '0');
    fecha.setAttribute('max', yyyy + '-' + mm + '-' + dd);

    function sumarDias(d, dias) {
      var x = new Date(d.getTime());
      x.setDate(x.getDate() + dias);
      return x;
    }
    function formatear(d) {
      return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    }
    function item(titulo, fechaObjetivo, texto) {
      return '<div class="timeline-item"><strong>' + titulo + ' · ' + formatear(fechaObjetivo) + '</strong><span>' + texto + '</span></div>';
    }
    function mostrarError(m) {
      timeline.innerHTML = '<div class="timeline-item"><strong>' + m + '</strong></div>';
      resultado.className = 'tool-result show tool-result-error';
    }
    function generar() {
      var v = fecha.value;
      if (!v) {
        mostrarError('Introduce la fecha de nacimiento.');
        fecha.focus();
        return;
      }
      var n = new Date(v + 'T12:00:00');
      if (isNaN(n.getTime())) {
        mostrarError('La fecha introducida no es válida.');
        fecha.focus();
        return;
      }
      var hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (n > hoy) {
        mostrarError('La fecha de nacimiento no puede ser futura.');
        fecha.focus();
        return;
      }
      timeline.innerHTML =
        item('Primeros días', sumarDias(n, 2), 'Revisa inscripción/Registro Civil, alta del bebé en Seguridad Social y tarjeta sanitaria según tu situación.') +
        item('Primera semana', sumarDias(n, 7), 'Comprueba que tienes identificados los trámites pendientes y guarda justificantes y resoluciones.') +
        item('Primer mes', sumarDias(n, 30), 'Revisa ayudas estatales, autonómicas y municipales y comprueba si alguna convocatoria tiene plazo propio.') +
        item('Dos meses', sumarDias(n, 60), 'Comprueba el estado de solicitudes, posibles requerimientos y deducciones fiscales aplicables.') +
        item('90 días', sumarDias(n, 90), 'Haz una revisión final de expedientes abiertos y actualiza tus ayudas y trámites pendientes.');
      resultado.className = 'tool-result show';
      if (resultado.scrollIntoView) resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    boton.addEventListener('click', generar, false);
    fecha.addEventListener('change', function () { resultado.className = 'tool-result'; timeline.innerHTML = ''; }, false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, false);
  else init();
})();