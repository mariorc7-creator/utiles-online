(function () {
  function escapar(texto) {
    return String(texto || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function asegurarEstilos() {
    if (document.getElementById("papelesia-checklist-estilos")) return;
    const style = document.createElement("style");
    style.id = "papelesia-checklist-estilos";
    style.textContent = `
      .papelesia-checklist{margin:0 0 26px;padding:24px;border:1px solid #dde1ff;border-radius:20px;background:linear-gradient(135deg,#f8f8ff,#fff);box-shadow:0 10px 30px rgba(80,86,180,.08)}
      .papelesia-checklist-cabecera{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
      .papelesia-checklist-marca{font-size:12px;font-weight:900;color:#5966e5;letter-spacing:.5px;margin-bottom:5px}
      .papelesia-checklist h3{margin:0 0 7px;font-size:22px;color:#22304a}
      .papelesia-checklist p{margin:0;color:#6f7b90;line-height:1.6}
      .papelesia-checklist button{flex:0 0 auto;padding:12px 16px;font-size:14px}
      .papelesia-checklist-resultado{display:none;margin-top:20px;padding-top:19px;border-top:1px solid #e5e6f3}
      .papelesia-checklist-resultado h4{margin:17px 0 8px;font-size:15px;color:#39455d}
      .papelesia-checklist-resultado ul{margin:0;padding-left:20px;color:#566176}
      .papelesia-checklist-resultado li{margin:7px 0;line-height:1.55}
      .papelesia-checklist-aviso{margin-top:16px;padding:12px 14px;background:#fff8e8;border:1px solid #f0ddb8;border-radius:12px;color:#735b27;font-size:13px;line-height:1.55}
      .papelesia-checklist-cargando{font-size:14px;color:#5966e5;font-weight:700}
      @media(max-width:650px){.papelesia-checklist-cabecera{display:block}.papelesia-checklist button{width:100%;margin-top:16px}}
    `;
    document.head.appendChild(style);
  }

  function datosParaIA() {
    const lista = typeof generarTramites === "function" ? generarTramites() : [];
    return {
      respuestas: typeof respuestas !== "undefined" ? respuestas : {},
      tramites: lista.map(function (t) {
        return {
          titulo: t.titulo,
          prioridad: t.prioridad,
          descripcion: t.descripcion
        };
      })
    };
  }

  async function analizarChecklistIA() {
    const boton = document.getElementById("papelesiaChecklistBoton");
    const salida = document.getElementById("papelesiaChecklistResultado");
    if (!boton || !salida) return;

    boton.disabled = true;
    boton.textContent = "Analizando…";
    salida.style.display = "block";
    salida.innerHTML = '<div class="papelesia-checklist-cargando">PapelesIA está revisando tu situación…</div>';

    const datos = datosParaIA();
    const mensaje = [
      "Analiza mi checklist personalizada usando solo los datos siguientes.",
      "No inventes ayudas, importes, plazos ni requisitos. No asegures que tengo derecho a una ayuda.",
      "Quiero una respuesta breve con estos apartados exactos: RESUMEN, PRIORIDAD AHORA, A TENER EN CUENTA.",
      "En PRIORIDAD AHORA dame como máximo 4 puntos ordenados.",
      "En A TENER EN CUENTA señala como máximo 4 comprobaciones que dependan de renta, cotización, municipio, convocatoria u otros requisitos.",
      "Datos:",
      JSON.stringify(datos)
    ].join("\n");

    try {
      const respuestaApi = await fetch("/api/papelesia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: mensaje }]
        })
      });

      const data = await respuestaApi.json();
      if (!respuestaApi.ok) throw new Error(data.error || "No se ha podido analizar la checklist.");

      const texto = escapar(data.reply || "").replace(/\n/g, "<br>");
      salida.innerHTML = `
        <div>${texto}</div>
        <div class="papelesia-checklist-aviso">
          PapelesIA complementa la checklist, pero no sustituye la información oficial. Comprueba siempre los requisitos definitivos en el organismo correspondiente.
        </div>
      `;
    } catch (error) {
      salida.innerHTML = `<div class="papelesia-checklist-aviso">${escapar(error.message || "PapelesIA no está disponible ahora mismo.")}</div>`;
    } finally {
      boton.disabled = false;
      boton.textContent = "✨ Analizar con PapelesIA";
    }
  }

  function insertarChecklistIA() {
    asegurarEstilos();
    const resultado = document.getElementById("resultado");
    if (!resultado || document.getElementById("papelesiaChecklist")) return;

    const bloque = document.createElement("section");
    bloque.id = "papelesiaChecklist";
    bloque.className = "papelesia-checklist";
    bloque.innerHTML = `
      <div class="papelesia-checklist-cabecera">
        <div>
          <div class="papelesia-checklist-marca">✨ PapelesIA</div>
          <h3>Tu checklist, revisada con IA</h3>
          <p>PapelesIA puede resumir tu situación y decirte qué conviene revisar primero según las respuestas que has dado.</p>
        </div>
        <button type="button" id="papelesiaChecklistBoton">✨ Analizar con PapelesIA</button>
      </div>
      <div id="papelesiaChecklistResultado" class="papelesia-checklist-resultado"></div>
    `;

    const cabecera = resultado.querySelector(".resultado-cabecera");
    if (cabecera && cabecera.nextSibling) {
      resultado.insertBefore(bloque, cabecera.nextSibling);
    } else if (cabecera) {
      resultado.appendChild(bloque);
    } else {
      resultado.prepend(bloque);
    }

    document.getElementById("papelesiaChecklistBoton").addEventListener("click", analizarChecklistIA);
  }

  window.insertarChecklistIA = insertarChecklistIA;
})();