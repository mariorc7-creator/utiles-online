(function () {
  function limpiarEstadoChecklist() {
    try {
      localStorage.removeItem("tramitesFacilesRespuestas");
      localStorage.removeItem("tramitesFacilesCompletados");
    } catch (e) {}

    if (typeof respuestas !== "undefined" && respuestas) {
      respuestas.comunidad = "";
      respuestas.fechaNacimiento = "";
      respuestas.situacionLaboral = "";
      respuestas.monoparental = null;
      respuestas.nacimientoMultiple = null;
      respuestas.discapacidadProgenitor = null;
    }

    const reanudar = document.getElementById("reanudarProgreso");
    if (reanudar) reanudar.innerHTML = "";
  }

  const continuarOriginal = typeof continuarProgreso === "function" ? continuarProgreso : null;

  window.continuarProgreso = function () {
    const cuestionario = document.getElementById("cuestionario");
    const resultado = document.getElementById("resultado");

    // En la home no existen estos contenedores: continuar ahí provocaba un error JS.
    if (!cuestionario || !resultado) {
      window.location.href = "/checklist/";
      return;
    }

    if (continuarOriginal) continuarOriginal();
  };

  window.empezarDeNuevo = function () {
    limpiarEstadoChecklist();

    // Reinicio limpio desde cualquier pantalla y sin arrastrar parámetros antiguos.
    window.location.href = "/checklist/";
  };

  window.guardarFechaNacimiento = function () {
    const campo = document.getElementById("fechaNacimiento");
    const error = document.getElementById("error");
    if (!campo) return;

    const fecha = campo.value;
    const ahora = new Date();
    const y = ahora.getFullYear();
    const m = String(ahora.getMonth() + 1).padStart(2, "0");
    const d = String(ahora.getDate()).padStart(2, "0");
    const hoy = `${y}-${m}-${d}`;

    if (!fecha) {
      if (error) {
        error.textContent = "Introduce la fecha de nacimiento.";
        error.style.display = "block";
      }
      return;
    }

    if (fecha > hoy) {
      if (error) {
        error.textContent = "La fecha de nacimiento no puede ser futura.";
        error.style.display = "block";
      }
      return;
    }

    if (error) error.style.display = "none";
    respuestas.fechaNacimiento = fecha;
    guardarProgreso();
    mostrarPaso3();
  };
})();
