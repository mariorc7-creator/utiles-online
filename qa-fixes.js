(function () {
  function limpiarEstadoPlan() {
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

  function normalizarTextoVisible() {
    if (!document.body) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const padre = node.parentElement;
          if (!padre) return NodeFilter.FILTER_REJECT;
          const tag = padre.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const cambios = [
      [/✓\s*Checklist personalizada/gi, "✓ Ayudas y trámites personalizados"],
      [/Checklist personalizada/gi, "Ayudas y trámites personalizados"],
      [/Dejaste la checklist a medias\./gi, "Dejaste tus ayudas y trámites a medias."],
      [/Continuar mi checklist\s*→?/gi, "Continuar donde lo dejé →"],
      [/Tu checklist anterior sigue guardada en este navegador\./gi, "Tus respuestas anteriores siguen guardadas en este navegador."],
      [/Estamos preparando un Plan Premium personalizado con tus fechas,\s*documentos, ayudas y próximos pasos\./gi, "Convierte tus respuestas en un plan completo con fechas, prioridades, documentos y ayudas reunidos en un único sitio."],
      [/Estamos preparando un Plan Premium personalizado con tus fechas, documentos, ayudas y próximos pasos\./gi, "Convierte tus respuestas en un plan completo con fechas, prioridades, documentos y ayudas reunidos en un único sitio."],
      [/Ver qué incluye\s*→?/gi, "Ver Plan Premium · 9,90 € →"]
    ];

    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue;
      let nuevo = original;
      cambios.forEach(([patron, reemplazo]) => {
        nuevo = nuevo.replace(patron, reemplazo);
      });
      if (nuevo !== original) node.nodeValue = nuevo;
    }
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

  function mejorarBloquePremium() {
    const premium = document.querySelector(".upsell-premium");
    if (!premium) return;

    const texto = premium.querySelector("p");
    if (texto) {
      texto.textContent = "Convierte tus respuestas en un plan completo con fechas, prioridades, documentos y ayudas reunidos en un único sitio.";
    }

    const enlace = premium.querySelector("a.cta-enlace");
    if (enlace) {
      enlace.textContent = "Ver Plan Premium · 9,90 € →";
      enlace.setAttribute("aria-label", "Ver qué incluye el Plan Premium por 9,90 euros, pago único");
    }
  }

  function reforzarEnlacesOficiales() {
    document.querySelectorAll('a[href^="http"]').forEach((enlace) => {
      try {
        const url = new URL(enlace.href);
        const host = url.hostname.toLowerCase();
        const oficial =
          host.endsWith(".gob.es") ||
          host.endsWith(".gencat.cat") ||
          host.endsWith(".seg-social.es") ||
          host.endsWith(".agenciatributaria.gob.es") ||
          host.endsWith(".mjusticia.gob.es");

        if (oficial) {
          enlace.setAttribute("rel", "noopener noreferrer");
          if (!enlace.getAttribute("title")) {
            enlace.setAttribute("title", "Abrir fuente oficial");
          }
        }
      } catch (e) {}
    });
  }

  function aplicarMejoras() {
    adaptarBloqueReanudar();
    mejorarBloquePremium();
    normalizarTextoVisible();
    reforzarEnlacesOficiales();
  }

  const continuarOriginal = typeof continuarProgreso === "function" ? continuarProgreso : null;

  window.continuarProgreso = function () {
    const cuestionario = document.getElementById("cuestionario");
    const resultado = document.getElementById("resultado");

    if (!cuestionario || !resultado) {
      window.location.href = "/checklist/";
      return;
    }

    if (continuarOriginal) continuarOriginal();
  };

  window.empezarDeNuevo = function () {
    limpiarEstadoPlan();
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
    aplicarMejoras();

    if (!document.body) return;
    let pendiente = false;
    const observer = new MutationObserver(function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () {
        pendiente = false;
        aplicarMejoras();
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
