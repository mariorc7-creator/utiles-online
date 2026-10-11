(function () {
  function init() {
    var boton = document.getElementById('calcularPermiso');
    var tipo = document.getElementById('tipo');
    var fecha = document.getElementById('fecha');
    var resultado = document.getElementById('resultado');
    if (!boton || !tipo || !fecha || !resultado) return;

    var ahora = new Date();
    var yyyy = ahora.getFullYear();
    var mm = String(ahora.getMonth() + 1).padStart(2, '0');
    var dd = String(ahora.getDate()).padStart(2, '0');
    fecha.setAttribute('max', yyyy + '-' + mm + '-' + dd);

    function formatear(d) {
      return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    }
    function sumarSemanas(d, s) {
      var x = new Date(d.getTime());
      x.setDate(x.getDate() + s * 7);
      return x;
    }
    function sumarAnios(d, a) {
      var x = new Date(d.getTime());
      x.setFullYear(x.getFullYear() + a);
      return x;
    }
    function mostrarError(m) {
      resultado.className = 'tool-result show tool-result-error';
      resultado.innerHTML = '<strong>' + m + '</strong>';
    }
    function calcular() {
      var v = fecha.value;
      if (!v) {
        mostrarError('Introduce una fecha de nacimiento o hecho causante.');
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
        mostrarError('La fecha no puede ser futura.');
        fecha.focus();
        return;
      }
      var mono = tipo.value === 'mono';
      var total = mono ? 32 : 19;
      var ob = 6;
      var h12 = mono ? 22 : 11;
      var h8 = mono ? 4 : 2;
      resultado.className = 'tool-result show';
      resultado.innerHTML = '<strong class="big">' + total + ' semanas</strong>' +
        '<p><b>' + ob + ' semanas obligatorias</b> e ininterrumpidas desde el hecho causante. Fin orientativo: ' + formatear(sumarSemanas(n, ob)) + '.</p>' +
        '<p><b>' + h12 + ' semanas</b> pueden distribuirse por semanas hasta que el menor cumpla 12 meses: ' + formatear(sumarAnios(n, 1)) + '.</p>' +
        '<p><b>' + h8 + ' semanas</b> adicionales pueden disfrutarse por semanas hasta los 8 años: ' + formatear(sumarAnios(n, 8)) + '.</p>';
      if (resultado.scrollIntoView) resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    boton.addEventListener('click', calcular, false);
    fecha.addEventListener('change', function () { resultado.className = 'tool-result'; resultado.innerHTML = ''; }, false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, false);
  else init();
})();