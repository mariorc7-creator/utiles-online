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

  function adaptarBloqueReanudar() {
    const contenedor = document.getElementById("reanudarProgreso");
    if (!contenedor) return;

    const contenido = contenedor.querySelector(".reanudar-contenido");
    if (!contenido) return;

    const titulo = contenido.querySelector("strong");
    const texto = contenido.querySelector("p");
    const botones = contenido.querySelectorAll("button");

    if (titulo) titulo.textContent = "¿Continuamos donde lo dejaste?";
    if (texto) texto.textContent = "Tus respuestas anteriores siguen guardadas en este navegador.";

    if (botones[0]) botones[0].textContent = "Continuar donde lo dejé →";
    if (botones[1]) {
      botones[1].textContent = "Descartar progreso";
      botones[1].setAttribute("aria-label", "Descartar las respuestas guardadas y empezar de nuevo");
      botones[1].setAttribute("title", "Borra las respuestas guardadas y empieza desde cero");
    }
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

  document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("reanudarProgreso");
    if (!contenedor) return;

    adaptarBloqueReanudar();

    const observer = new MutationObserver(function () {
      adaptarBloqueReanudar();
    });

    observer.observe(contenedor, { childList: true, subtree: true });
  });
})();
