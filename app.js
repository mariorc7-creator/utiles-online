// ==========================================
// PAPELES DEL BEBÉ
// Cuestionario para nuevos padres
// ==========================================

const respuestas = {
  comunidad: "",
  fechaNacimiento: "",
  situacionLaboral: "",
  monoparental: null,
  nacimientoMultiple: null,
  discapacidadProgenitor: null
};

let pasoActual = 1;


// ==========================================
// INICIO
// ==========================================

function empezar() {
  document.getElementById("portada").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("cuestionario").style.display = "block";

  mostrarPaso1();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==========================================
// PASO 1 - COMUNIDAD AUTÓNOMA
// ==========================================

function mostrarPaso1() {

  pasoActual = 1;

  const cuestionario = document.getElementById("cuestionario");

  cuestionario.innerHTML = `
    <div class="progreso">
      PASO 1 DE 6
    </div>

    <div class="pregunta">

      <h2>¿En qué comunidad autónoma resides?</h2>

      <p>
        Esto nos permitirá mostrarte trámites y ayudas
        que dependan de tu comunidad autónoma.
      </p>

      <select id="comunidad">

        <option value="">Selecciona tu comunidad autónoma</option>

        <option>Andalucía</option>
        <option>Aragón</option>
        <option>Asturias</option>
        <option>Islas Baleares</option>
        <option>Canarias</option>
        <option>Cantabria</option>
        <option>Castilla-La Mancha</option>
        <option>Castilla y León</option>
        <option>Cataluña</option>
        <option>Comunidad Valenciana</option>
        <option>Extremadura</option>
        <option>Galicia</option>
        <option>Comunidad de Madrid</option>
        <option>Región de Murcia</option>
        <option>Navarra</option>
        <option>País Vasco</option>
        <option>La Rioja</option>
        <option>Ceuta</option>
        <option>Melilla</option>

      </select>

      <div class="error" id="error">
        Selecciona una comunidad autónoma.
      </div>

      <div class="botones">

        <button class="volver" onclick="volverPortada()">
          ← Volver
        </button>

        <button onclick="guardarComunidad()">
          Continuar →
        </button>

      </div>

    </div>
  `;

  if (respuestas.comunidad) {
    document.getElementById("comunidad").value = respuestas.comunidad;
  }
}


function guardarComunidad() {

  const comunidad = document.getElementById("comunidad").value;

  if (!comunidad) {
    document.getElementById("error").style.display = "block";
    return;
  }

  respuestas.comunidad = comunidad;

  guardarProgreso();
  mostrarPaso2();
}


// ==========================================
// PASO 2 - FECHA DE NACIMIENTO
// ==========================================

function mostrarPaso2() {

  pasoActual = 2;

  const cuestionario = document.getElementById("cuestionario");

  const hoy = new Date().toISOString().split("T")[0];

  cuestionario.innerHTML = `
    <div class="progreso">
      PASO 2 DE 6
    </div>

    <div class="pregunta">

      <h2>¿Cuándo nació tu bebé?</h2>

      <p>
        Utilizaremos la fecha para avisarte de posibles
        plazos y trámites pendientes.
      </p>

      <input
        type="date"
        id="fechaNacimiento"
        max="${hoy}"
        value="${respuestas.fechaNacimiento || ""}"
        style="
          width:100%;
          padding:16px;
          font-size:17px;
          border:1px solid #ccd3df;
          border-radius:10px;
          margin-bottom:22px;
          color:#172033;
          background:white;
        "
      >

      <div class="error" id="error">
        Introduce la fecha de nacimiento.
      </div>

      <div class="botones">

        <button class="volver" onclick="mostrarPaso1()">
          ← Volver
        </button>

        <button onclick="guardarFechaNacimiento()">
          Continuar →
        </button>

      </div>

    </div>
  `;
}


function guardarFechaNacimiento() {

  const fecha = document.getElementById("fechaNacimiento").value;

  if (!fecha) {
    document.getElementById("error").style.display = "block";
    return;
  }

  respuestas.fechaNacimiento = fecha;

  guardarProgreso();
  mostrarPaso3();
}


// ==========================================
// PASO 3 - SITUACIÓN LABORAL
// ==========================================

function mostrarPaso3() {

  pasoActual = 3;

  const cuestionario = document.getElementById("cuestionario");

  cuestionario.innerHTML = `
    <div class="progreso">
      PASO 3 DE 6
    </div>

    <div class="pregunta">

      <h2>¿Cuál es tu situación laboral?</h2>

      <p>
        Nos ayudará a orientarte sobre prestaciones
        relacionadas con el nacimiento y cuidado del menor.
      </p>

      <div class="opciones">

        ${crearOpcion(
          "asalariado",
          "Trabajo por cuenta ajena",
          "Soy trabajador/a asalariado/a"
        )}

        ${crearOpcion(
          "autonomo",
          "Trabajo por cuenta propia",
          "Soy autónomo/a"
        )}

        ${crearOpcion(
          "desempleado",
          "Estoy desempleado/a",
          "Con o sin prestación por desempleo"
        )}

        ${crearOpcion(
          "no_trabajo",
          "Actualmente no trabajo",
          "No estoy trabajando ni como asalariado ni como autónomo"
        )}

      </div>

      <div class="error" id="error">
        Selecciona una opción.
      </div>

      <div class="botones">

        <button class="volver" onclick="mostrarPaso2()">
          ← Volver
        </button>

        <button onclick="guardarSituacionLaboral()">
          Continuar →
        </button>

      </div>

    </div>
  `;

  restaurarOpcion(respuestas.situacionLaboral);
}


function crearOpcion(valor, titulo, descripcion) {

  return `
    <label class="opcion">

      <input
        type="radio"
        name="situacionLaboral"
        value="${valor}"
        onchange="marcarOpcion(this)"
      >

      <div class="opcion-texto">
        <strong>${titulo}</strong>
        <span>${descripcion}</span>
      </div>

    </label>
  `;
}


function marcarOpcion(input) {

  document.querySelectorAll(".opcion").forEach(opcion => {
    opcion.classList.remove("seleccionada");
  });

  input.closest(".opcion").classList.add("seleccionada");
}


function restaurarOpcion(valor) {

  if (!valor) return;

  const input = document.querySelector(
    `input[name="situacionLaboral"][value="${valor}"]`
  );

  if (input) {
    input.checked = true;
    input.closest(".opcion").classList.add("seleccionada");
  }
}


function guardarSituacionLaboral() {

  const seleccion = document.querySelector(
    'input[name="situacionLaboral"]:checked'
  );

  if (!seleccion) {
    document.getElementById("error").style.display = "block";
    return;
  }

  respuestas.situacionLaboral = seleccion.value;

  guardarProgreso();
  mostrarPaso4();
}


// ==========================================
// PASO 4 - FAMILIA MONOPARENTAL
// ==========================================

function mostrarPaso4() {

  pasoActual = 4;

  mostrarPreguntaSiNo(
    4,
    "¿Es una familia monoparental?",
    "Esta situación puede afectar a determinadas ayudas y prestaciones.",
    respuestas.monoparental,

    function(valor) {
      respuestas.monoparental = valor;
      guardarProgreso();
      mostrarPaso5();
    },

    mostrarPaso3
  );
}


// ==========================================
// PASO 5 - NACIMIENTO MÚLTIPLE
// ==========================================

function mostrarPaso5() {

  pasoActual = 5;

  mostrarPreguntaSiNo(
    5,
    "¿Ha sido un nacimiento múltiple?",
    "Por ejemplo, gemelos, mellizos o un parto de más bebés.",
    respuestas.nacimientoMultiple,

    function(valor) {
      respuestas.nacimientoMultiple = valor;
      guardarProgreso();
      mostrarPaso6();
    },

    mostrarPaso4
  );
}


// ==========================================
// PASO 6 - DISCAPACIDAD
// ==========================================

function mostrarPaso6() {

  pasoActual = 6;

  mostrarPreguntaSiNo(
    6,
    "¿Alguno de los progenitores tiene una discapacidad reconocida?",
    "Esta circunstancia puede afectar a determinadas prestaciones.",
    respuestas.discapacidadProgenitor,

    function(valor) {
      respuestas.discapacidadProgenitor = valor;
      guardarProgreso();

      // V8: ruta separada para poder medir finalizaciones como pageviews.
      if (window.location.pathname.startsWith("/checklist")) {
        window.location.href = "/checklist/completada/";
      } else {
        mostrarResultadoProvisional();
      }
    },

    mostrarPaso5
  );
}


// ==========================================
// PREGUNTAS SÍ / NO
// ==========================================

function mostrarPreguntaSiNo(
  paso,
  titulo,
  descripcion,
  valorActual,
  siguiente,
  anterior
) {

  const cuestionario = document.getElementById("cuestionario");

  cuestionario.innerHTML = `
    <div class="progreso">
      PASO ${paso} DE 6
    </div>

    <div class="pregunta">

      <h2>${titulo}</h2>

      <p>${descripcion}</p>

      <div class="opciones">

        <label class="opcion">
          <input
            type="radio"
            name="respuestaSiNo"
            value="si"
          >

          <div class="opcion-texto">
            <strong>Sí</strong>
          </div>
        </label>


        <label class="opcion">
          <input
            type="radio"
            name="respuestaSiNo"
            value="no"
          >

          <div class="opcion-texto">
            <strong>No</strong>
          </div>
        </label>

      </div>

      <div class="error" id="error">
        Selecciona una opción.
      </div>

      <div class="botones">

        <button class="volver" id="botonAnterior">
          ← Volver
        </button>

        <button id="botonContinuar">
          Continuar →
        </button>

      </div>

    </div>
  `;


  const inputs = document.querySelectorAll(
    'input[name="respuestaSiNo"]'
  );

  inputs.forEach(input => {

    input.addEventListener("change", function() {

      document.querySelectorAll(".opcion").forEach(opcion => {
        opcion.classList.remove("seleccionada");
      });

      this.closest(".opcion").classList.add("seleccionada");
    });

  });


  if (valorActual !== null) {

    const valor = valorActual ? "si" : "no";

    const inputGuardado = document.querySelector(
      `input[name="respuestaSiNo"][value="${valor}"]`
    );

    if (inputGuardado) {
      inputGuardado.checked = true;
      inputGuardado.closest(".opcion").classList.add("seleccionada");
    }
  }


  document
    .getElementById("botonAnterior")
    .addEventListener("click", anterior);


  document
    .getElementById("botonContinuar")
    .addEventListener("click", function() {

      const seleccion = document.querySelector(
        'input[name="respuestaSiNo"]:checked'
      );

      if (!seleccion) {
        document.getElementById("error").style.display = "block";
        return;
      }

      siguiente(seleccion.value === "si");
    });
}
// ==========================================
// CHECKLIST PERSONALIZADA
// ==========================================

const enlacesOficiales = {
  nacimiento:
    "https://sede.mjusticia.gob.es/es/tramites/inscripcion-nacimiento",

  seguridadSocial:
    "https://prestaciones.seg-social.es/",

  prestacionNacimiento:
    "https://prestaciones.seg-social.es/servicio/prestacion-nacimiento-adopcion-cuidado-menor",

  maternidad:
    "https://sede.agenciatributaria.gob.es/Sede/procedimientos/GZ25.shtml",

  ayudaCataluna:
    "https://tramits.gencat.cat/es/tramits/tramits-temes/Prestacio-per-a-families-amb-infants?moda=1",

  catsalut:
    "https://canalsalut.gencat.cat/"
};


// ==========================================
// GENERAR RESULTADO
// ==========================================

function mostrarResultadoProvisional() {

  document.getElementById("cuestionario").style.display = "none";

  const resultado = document.getElementById("resultado");

  resultado.style.display = "block";

  const tramites = generarTramites();

  resultado.innerHTML = `
    <div class="resultado-cabecera">

      <div class="badge">
        ✓ Checklist personalizada
      </div>

      <h2>Tu plan después del nacimiento</h2>

      <p>
        Hemos preparado estos pasos según las respuestas
        que nos has dado.
      </p>

      <p>
        <strong>${respuestas.comunidad}</strong>
        · Bebé nacido el
        <strong>${formatearFecha(respuestas.fechaNacimiento)}</strong>
      </p>

      <div
        id="contadorProgreso"
        style="
          margin-top:20px;
          padding:16px 18px;
          background:#eef3ff;
          border-radius:12px;
          font-weight:700;
          color:#2856b6;
        "
      >
      <div class="barra-progreso">
  <div
    class="barra-progreso-interior"
    id="barraProgreso"
  ></div>
</div>
      </div>

    </div>

    <div id="listaTramites">
      ${tramites.map(crearTarjetaTramite).join("")}
    </div>

    <section class="upsell-gestoria">

      <div class="upsell-premium-badge">
        🤝 AYUDA PROFESIONAL
      </div>

      <h3>
        ¿Prefieres que una gestoría te ayude?
      </h3>

      <p>
        Puedes solicitar contacto profesional para revisar
        o gestionar tus trámites.
      </p>

      <a
        class="cta-gestoria"
        href="/gestoria/?origen=checklist"
      >
        Quiero ayuda profesional →
      </a>

      <small>
        Opcional. Tu checklist gratuita seguirá disponible.
      </small>

    </section>

    <section class="upsell-premium">
      <div class="upsell-premium-badge">✨ OPCIONAL</div>
      <h3>¿Quieres tenerlo todo resumido en un único plan?</h3>
      <p>
        Estamos preparando un Plan Premium personalizado con tus fechas,
        documentos, ayudas y próximos pasos.
      </p>
      <div class="upsell-premium-precio">
        <strong>9,90 €</strong>
        <span>pago único</span>
      </div>
      <a class="cta-enlace" href="/premium/">
        Ver qué incluye →
      </a>
      <small>Tu checklist gratuita seguirá disponible.</small>
    </section>

    <div style="margin-top:30px;">

      <button onclick="reiniciarCuestionario()">
        Modificar mis respuestas
      </button>

    </div>

    <p
      style="
        margin-top:30px;
        color:#778092;
        font-size:13px;
        line-height:1.5;
      "
    >
      Esta web es una guía independiente y no pertenece
      a ninguna Administración Pública. Comprueba siempre
      la información definitiva en el organismo oficial enlazado.
    </p>
  `;

  restaurarTramitesCompletados();
  function actualizarContador() {

  const checks = document.querySelectorAll(".checkTramite");

  const completados = document.querySelectorAll(
    ".checkTramite:checked"
  );

  const contador = document.getElementById(
    "contadorProgreso"
  );

  const barra = document.getElementById(
    "barraProgreso"
  );

  if (!contador) return;

  const total = checks.length;
  const hechos = completados.length;

  const porcentaje =
    total === 0
      ? 0
      : Math.round((hechos / total) * 100);


  contador.childNodes[0].textContent =
    `${hechos} de ${total} trámites completados`;


  if (barra) {
    barra.style.width = `${porcentaje}%`;
  }


  if (total > 0 && hechos === total) {

    contador.childNodes[0].textContent =
      `🎉 ¡Checklist completada! ${hechos} de ${total}`;

  }
}

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==========================================
// DECIDIR QUÉ TRÁMITES MOSTRAR
// ==========================================

function generarTramites() {

  const tramites = [];


  // ------------------------------------------
  // REGISTRO CIVIL
  // ------------------------------------------

  tramites.push({
    id: "registro-civil",
    prioridad: "PRIMERO",
    titulo: "Comprobar la inscripción del nacimiento",
    descripcion:
      "Comprueba que el nacimiento de tu bebé ha quedado inscrito correctamente en el Registro Civil.",
    detalle:
      "En muchos casos el hospital comunica directamente el nacimiento al Registro Civil. Si ya se gestionó desde el hospital, puedes marcar este paso como completado.",
    enlace: enlacesOficiales.nacimiento,
    textoEnlace: "Información oficial →"
  });


  // ------------------------------------------
  // SEGURIDAD SOCIAL
  // ------------------------------------------

  tramites.push({
    id: "seguridad-social-bebe",
    prioridad: "IMPORTANTE",
    titulo: "Comprobar el alta del bebé para asistencia sanitaria",
    descripcion:
      "Comprueba que tu bebé consta correctamente para poder acceder a la asistencia sanitaria pública.",
    detalle:
      respuestas.comunidad === "Cataluña"
        ? "En Cataluña, determinados trámites pueden iniciarse desde el hospital. Comprueba si ya se gestionó antes de volver a solicitarlo."
        : "Comprueba la situación del bebé y realiza el alta correspondiente si todavía no se ha gestionado.",
    enlace: enlacesOficiales.seguridadSocial,
    textoEnlace: "Seguridad Social →"
  });


  // ------------------------------------------
  // TARJETA SANITARIA CATALUÑA
  // ------------------------------------------

  if (respuestas.comunidad === "Cataluña") {

    tramites.push({
      id: "tsi-cataluna",
      prioridad: "IMPORTANTE",
      titulo: "Solicitar la tarjeta sanitaria individual (TSI)",
      descripcion:
        "Cuando corresponda, solicita la tarjeta sanitaria de tu bebé para acceder normalmente al sistema sanitario catalán.",
      detalle:
        "Comprueba previamente que los datos necesarios del bebé estén correctamente registrados.",
      enlace: enlacesOficiales.catsalut,
      textoEnlace: "Ir a CatSalut →"
    });

  }


  // ------------------------------------------
  // EMPADRONAMIENTO
  // ------------------------------------------

  tramites.push({
    id: "empadronamiento",
    prioridad: "REVISAR",
    titulo: "Comprobar el empadronamiento del bebé",
    descripcion:
      "Comprueba que tu bebé consta correctamente empadronado en vuestro domicilio.",
    detalle:
      "La forma concreta de realizar o comprobar este trámite depende de tu ayuntamiento.",
    enlace: "",
    textoEnlace: ""
  });


  // ------------------------------------------
  // PRESTACIÓN NACIMIENTO Y CUIDADO
  // ------------------------------------------

  if (
    respuestas.situacionLaboral === "asalariado" ||
    respuestas.situacionLaboral === "autonomo"
  ) {

    let detallePrestacion =
      "La Seguridad Social exige determinados requisitos de alta y cotización. Comprueba tu situación y solicita la prestación si cumples los requisitos.";

    if (respuestas.monoparental) {

      detallePrestacion +=
        " Has indicado que sois una familia monoparental, circunstancia que puede modificar la duración del descanso.";

    }

    if (respuestas.nacimientoMultiple) {

      detallePrestacion +=
        " También has indicado un nacimiento múltiple, que puede dar derecho a ampliaciones adicionales.";

    }

    tramites.push({
      id: "prestacion-nacimiento",
      prioridad: "💰 PRESTACIÓN",
      titulo: "Prestación por nacimiento y cuidado del menor",
      descripcion:
        respuestas.monoparental
          ? "Comprueba tu derecho a la prestación y al periodo de descanso correspondiente para familias monoparentales."
          : "Comprueba tu derecho a la prestación económica y al periodo de descanso por nacimiento.",
      detalle: detallePrestacion,
      enlace: enlacesOficiales.prestacionNacimiento,
      textoEnlace: "Comprobar y solicitar →"
    });

  }


  // ------------------------------------------
  // SI ESTÁ DESEMPLEADO
  // ------------------------------------------

  if (respuestas.situacionLaboral === "desempleado") {

    tramites.push({
      id: "situacion-desempleo",
      prioridad: "REVISAR",
      titulo: "Revisar tu situación con la Seguridad Social",
      descripcion:
        "Al estar desempleado/a, el derecho y la forma de gestionar las prestaciones pueden depender de tu situación concreta.",
      detalle:
        "No damos por hecho que tengas o no derecho. Comprueba tu situación de alta, cotización y prestación por desempleo con la Seguridad Social.",
      enlace: enlacesOficiales.prestacionNacimiento,
      textoEnlace: "Comprobar mi situación →"
    });

  }


  // ------------------------------------------
  // NACIMIENTO MÚLTIPLE
  // ------------------------------------------

  if (respuestas.nacimientoMultiple) {

    tramites.push({
      id: "ayuda-nacimiento-multiple",
      prioridad: "💰 POSIBLE AYUDA",
      titulo: "Prestación por nacimiento múltiple",
      descripcion:
        "Has indicado que ha sido un nacimiento múltiple. Puede existir una prestación económica específica.",
      detalle:
        "Comprueba los requisitos y el importe que correspondería en tu caso.",
      enlace: enlacesOficiales.seguridadSocial,
      textoEnlace: "Comprobar prestación →"
    });

  }


  // ------------------------------------------
  // MONOPARENTAL / DISCAPACIDAD
  // ------------------------------------------

  if (
    respuestas.monoparental ||
    respuestas.discapacidadProgenitor
  ) {

    tramites.push({
      id: "pago-unico-especial",
      prioridad: "💰 POSIBLE AYUDA",
      titulo: "Comprobar prestación de pago único",
      descripcion:
        "Tu situación puede encajar en una prestación económica de pago único de la Seguridad Social.",
      detalle:
        respuestas.discapacidadProgenitor
          ? "Has indicado discapacidad reconocida de un progenitor. La prestación tiene requisitos específicos, incluido el grado de discapacidad en determinados supuestos."
          : "Has indicado que sois una familia monoparental. Comprueba los requisitos económicos y familiares de esta prestación.",
      enlace: enlacesOficiales.seguridadSocial,
      textoEnlace: "Comprobar requisitos →"
    });

  }


  // ------------------------------------------
  // DEDUCCIÓN MATERNIDAD
  // ------------------------------------------

  tramites.push({
    id: "deduccion-maternidad",
    prioridad: "💰 REVISAR",
    titulo: "Comprobar la deducción por maternidad",
    descripcion:
      "Comprueba si existe derecho a la deducción por maternidad y si te interesa solicitar su abono anticipado.",
    detalle:
      "Cuando existe derecho al abono anticipado, la Agencia Tributaria permite solicitarlo mediante el modelo 140.",
    enlace: enlacesOficiales.maternidad,
    textoEnlace: "Comprobar Modelo 140 →"
  });


  // ------------------------------------------
  // AYUDA CATALUÑA
  // ------------------------------------------

  if (respuestas.comunidad === "Cataluña") {

    const infoAyuda = calcularAyudaCataluna();

    tramites.push({
      id: "ayuda-cataluna",
      prioridad: infoAyuda.expirada
        ? "PLAZO A REVISAR"
        : "💰 AYUDA",
      titulo: "Prestación para familias con hijos de Cataluña",
      descripcion:
        respuestas.monoparental
          ? "Podrías optar a una prestación de 750 € si tienes reconocido el título de familia monoparental y cumples el límite de ingresos."
          : "Podrías optar a una prestación de 650 € si cumples el límite de ingresos. Determinadas familias numerosas o monoparentales pueden recibir 750 €.",
      detalle: infoAyuda.mensaje,
      enlace: enlacesOficiales.ayudaCataluna,
      textoEnlace: "Comprobar requisitos y solicitar →"
    });

  }


  return tramites;
}


// ==========================================
// AYUDA CATALUÑA - PLAZO
// ==========================================

function calcularAyudaCataluna() {

  const fechaNacimiento = crearFechaLocal(
    respuestas.fechaNacimiento
  );

  if (!fechaNacimiento) {
    return {
      expirada: false,
      mensaje:
        "Comprueba los requisitos económicos y el plazo oficial."
    };
  }

  const cambioNormativa = new Date(2026, 6, 14);

  const mesesPlazo =
    fechaNacimiento >= cambioNormativa ? 3 : 1;

  const fechaLimite = sumarMesesConReglaFinMes(
    fechaNacimiento,
    mesesPlazo
  );

  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  const diferencia =
    fechaLimite.getTime() - hoy.getTime();

  const diasRestantes =
    Math.ceil(diferencia / (1000 * 60 * 60 * 24));


  if (diasRestantes < 0) {

    return {
      expirada: true,
      mensaje:
        `Según la fecha indicada, el plazo ordinario calculado habría finalizado el ${formatearFechaObjeto(fechaLimite)}. Comprueba tu caso en la Generalitat.`
    };

  }


  if (diasRestantes === 0) {

    return {
      expirada: false,
      mensaje:
        `⚠️ Según la fecha indicada, el plazo ordinario termina hoy (${formatearFechaObjeto(fechaLimite)}). Revisa inmediatamente los requisitos oficiales.`
    };

  }


  return {
    expirada: false,
    mensaje:
      `⚠️ Según la fecha indicada, el plazo ordinario termina el ${formatearFechaObjeto(fechaLimite)}. Quedan aproximadamente ${diasRestantes} días. Comprueba también el límite de ingresos antes de solicitarla.`
  };
}


// ==========================================
// TARJETAS
// ==========================================

function crearTarjetaTramite(tramite) {

  const enlaceHTML = tramite.enlace
    ? `
      <a
        href="${tramite.enlace}"
        target="_blank"
        rel="noopener noreferrer"
        class="enlace-oficial"
      >
        Ir al trámite oficial →
      </a>
    `
    : "";


  return `
    <div class="tramite" id="tramite-${tramite.id}">

      <span class="prioridad">
        ${tramite.prioridad}
      </span>

      <h3>${tramite.titulo}</h3>

      <p>${tramite.descripcion}</p>

      ${
        tramite.id === "ayuda-cataluna"
          ? crearAvisoDineroCataluna()
          : ""
      }

      <button
        type="button"
        class="boton-guia"
        onclick="alternarGuia('${tramite.id}', this)"
      >
        Guíame paso a paso ↓
      </button>

      <div
        class="guia-tramite"
        id="guia-${tramite.id}"
        style="display:none;"
      >

        ${crearContenidoGuia(tramite)}

        ${enlaceHTML}

      </div>

      <div class="tramite-check">

        <label>

          <input
            type="checkbox"
            class="checkTramite"
            data-id="${tramite.id}"
            onchange="cambiarEstadoTramite(this)"
          >

          <span>Ya lo he hecho</span>

        </label>

      </div>

    </div>
  `;
}
function alternarGuia(id, boton) {

  const guia = document.getElementById(`guia-${id}`);

  if (!guia) return;

  const abierta = guia.style.display === "block";

  guia.style.display = abierta ? "none" : "block";

  boton.textContent = abierta
    ? "Guíame paso a paso ↓"
    : "Cerrar guía ↑";
}


function crearContenidoGuia(tramite) {

  switch (tramite.id) {

    case "registro-civil":

      return `
        <h4>¿Qué tienes que hacer?</h4>

        <ol>
          <li>
            Comprueba si el hospital comunicó el nacimiento
            al Registro Civil.
          </li>

          <li>
            Si ya fue comunicado correctamente, no vuelvas
            a realizar el mismo trámite.
          </li>

          <li>
            Si no se gestionó desde el hospital, consulta
            cómo realizar la inscripción correspondiente.
          </li>
        </ol>

        <div class="consejo">
          💡 <strong>Consejo:</strong>
          pregunta primero al hospital o comprueba la documentación
          que os entregaron al alta.
        </div>
      `;


    case "seguridad-social-bebe":

      return `
        <h4>Objetivo</h4>

        <p>
          Comprobar que el bebé está correctamente reconocido
          para recibir asistencia sanitaria pública.
        </p>

        <h4>Qué haría ahora</h4>

        <ol>
          <li>
            Comprueba si el hospital inició ya la gestión.
          </li>

          <li>
            Si ya está realizada, marca este paso como hecho.
          </li>

          <li>
            Si no consta, accede a la Seguridad Social
            para comprobar cómo tramitarlo.
          </li>
        </ol>
      `;


    case "tsi-cataluna":

      return `
        <h4>¿Para qué sirve?</h4>

        <p>
          La TSI identifica al bebé para acceder a los
          servicios del sistema sanitario público catalán.
        </p>

        <h4>Antes de solicitarla</h4>

        <ul>
          <li>
            Comprueba que los datos administrativos del bebé
            estén correctamente registrados.
          </li>

          <li>
            Comprueba el empadronamiento cuando sea necesario.
          </li>
        </ul>

        <div class="consejo">
          💡 Si tienes dudas, tu CAP puede indicarte si el bebé
          ya consta correctamente en el sistema.
        </div>
      `;


    case "empadronamiento":

      return `
        <h4>Qué tienes que comprobar</h4>

        <p>
          Verifica que el bebé figure empadronado en vuestro
          domicilio.
        </p>

        <h4>¿Dónde se hace?</h4>

        <p>
          Este trámite depende del ayuntamiento del municipio
          donde residís.
        </p>

        <div class="consejo">
          💡 Más adelante haremos que la web detecte el municipio
          y te lleve directamente al trámite correspondiente.
        </div>
      `;


    case "prestacion-nacimiento":

  return `
    <h4>👶 Prestación por nacimiento y cuidado del menor</h4>

    <p>
      Si trabajas por cuenta ajena o como autónomo,
      podrías tener derecho al permiso y a una prestación
      económica de la Seguridad Social.
    </p>

    <div class="caja-dinero">
      <div class="caja-dinero-icono">💰</div>
      <div>
        <strong>Prestación del 100 % de la base reguladora</strong>
        <p>
          Para nacimientos actuales, el permiso general es
          de 19 semanas por progenitor.
        </p>
      </div>
    </div>

    <button
      type="button"
      class="boton-guia"
      onclick="abrirEvaluadorNacimiento()"
    >
      👶 Comprobar mi prestación
    </button>

    <div
      id="evaluadorNacimiento"
      style="display:none; margin-top:20px;"
    ></div>
  `;


    case "situacion-desempleo":

      return `
        <h4>No queremos darte una respuesta incorrecta</h4>

        <p>
          Estar desempleado no determina por sí solo si existe
          o no derecho a una prestación relacionada con el nacimiento.
        </p>

        <p>
          Hay que comprobar tu situación concreta respecto a
          prestaciones por desempleo, alta y cotizaciones.
        </p>

        <div class="consejo">
          💡 Por eso te enviamos directamente a la fuente oficial
          en lugar de decirte automáticamente que tienes o no derecho.
        </div>
      `;


    case "ayuda-nacimiento-multiple":

      return `
        <h4>💰 Posible prestación adicional</h4>

        <p>
          La Seguridad Social contempla una prestación económica
          específica en determinados supuestos de nacimiento múltiple.
        </p>

        <h4>Qué hacer</h4>

        <ol>
          <li>
            Comprueba los requisitos oficiales.
          </li>

          <li>
            Revisa la cuantía que corresponde al número de bebés.
          </li>

          <li>
            Solicítala si cumples las condiciones.
          </li>
        </ol>
      `;


    case "pago-unico-especial":

      return `
        <h4>💰 Comprueba esta prestación</h4>

        <p>
          La Seguridad Social contempla prestaciones de pago único
          para determinados supuestos familiares.
        </p>

        <p>
          Tu respuesta indica que merece la pena comprobar
          si encajas en alguno de ellos.
        </p>

        <div class="aviso-importante">
          ⚠️ No significa automáticamente que tengas derecho:
          existen requisitos familiares, económicos y/o de discapacidad.
        </div>
      `;

case "deduccion-maternidad":

  return `
    <h4>💶 Deducción por maternidad</h4>

    <p>
      Si cumples los requisitos de la Agencia Tributaria,
      podrías tener derecho a la deducción por maternidad.
    </p>

    <div class="caja-dinero">
      <div class="caja-dinero-icono">💶</div>

      <div>
        <strong>Hasta 1.200 € al año por hijo</strong>

        <p>
          Puede cobrarse mediante la declaración de la renta
          o solicitarse anticipadamente cuando corresponda.
        </p>
      </div>
    </div>

    <button
      type="button"
      class="boton-guia"
      onclick="abrirEvaluadorMaternidad()"
    >
      💶 Comprobar si puedo tener derecho
    </button>

    <div
      id="evaluadorMaternidad"
      style="display:none; margin-top:20px;"
    ></div>
  `;

      
case "ayuda-cataluna":

  return `
    <h4>💰 Prestación de la Generalitat</h4>

    <p>
      Esta ayuda es de <strong>650 € por bebé</strong>.
      Puede alcanzar <strong>750 €</strong> si tienes reconocido
      el título de familia numerosa o monoparental.
    </p>

    <div class="aviso-importante">
      ${calcularAyudaCataluna().mensaje}
    </div>

    <button
      type="button"
      class="boton-guia"
      onclick="abrirEvaluadorCataluna()"
      style="margin-top:18px;"
    >
      💰 Comprobar si me corresponde
    </button>

    <div
      id="evaluadorCataluna"
      style="display:none; margin-top:20px;"
    ></div>
  `;


  }
}


function crearAvisoDineroCataluna() {

  const info = calcularAyudaCataluna();

  return `
    <div class="caja-dinero">

      <div class="caja-dinero-icono">
        💰
      </div>

      <div>

        <strong>
          ${
            respuestas.monoparental
              ? "Podrías optar a 750 €"
              : "Podrías optar a 650 €"
          }
        </strong>

        <p>
          ${
            info.expirada
              ? "El plazo ordinario calculado podría haber finalizado."
              : info.mensaje
          }
        </p>

      </div>

    </div>
  `;
}
// ==========================================
// EVALUADOR PRESTACIÓN NACIMIENTO
// ==========================================

function abrirEvaluadorNacimiento() {

  const contenedor =
    document.getElementById("evaluadorNacimiento");

  if (!contenedor) return;

  contenedor.style.display = "block";

  contenedor.innerHTML = `
    <div class="evaluador">

      <h4>Comprobemos tu situación</h4>

      <p>
        No necesitamos nóminas ni datos personales.
        Solo algunos datos para orientarte.
      </p>

      <label class="campo-evaluador">

        <strong>¿Qué edad tienes?</strong>

        <input
          type="number"
          id="edadNacimiento"
          min="16"
          max="70"
          placeholder="Ej. 34"
        >

      </label>

      <label class="campo-evaluador">

        <strong>
          ¿Estás actualmente de alta en la Seguridad Social
          o en una situación asimilada al alta?
        </strong>

        <select id="altaNacimiento">
          <option value="">Selecciona</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
          <option value="duda">No estoy seguro/a</option>
        </select>

      </label>

      <div id="bloqueCotizacionNacimiento">

        <label class="campo-evaluador">

          <strong>
            ¿Cuánto tiempo has cotizado?
          </strong>

          <span>
            No necesitamos el número exacto de días.
          </span>

          <select id="cotizacionNacimiento">

            <option value="">Selecciona</option>

            <option value="menos90">
              Menos de 90 días
            </option>

            <option value="90_179">
              Entre 90 y 179 días
            </option>

            <option value="180_359">
              Entre 180 y 359 días
            </option>

            <option value="360omas">
              360 días o más
            </option>

            <option value="duda">
              No lo sé
            </option>

          </select>

        </label>

      </div>

      <button
        type="button"
        onclick="evaluarPrestacionNacimiento()"
      >
        Ver resultado →
      </button>

      <div
        id="resultadoNacimiento"
        style="margin-top:20px;"
      ></div>

    </div>
  `;
}


// ==========================================
// EVALUAR PRESTACIÓN
// ==========================================

function evaluarPrestacionNacimiento() {

  const edad =
    Number(document.getElementById("edadNacimiento").value);

  const alta =
    document.getElementById("altaNacimiento").value;

  const cotizacion =
    document.getElementById("cotizacionNacimiento").value;

  const resultado =
    document.getElementById("resultadoNacimiento");


  if (!edad || !alta || !cotizacion) {

    resultado.innerHTML = `
      <div class="resultado-duda">
        ⚠️ Completa todos los campos para hacer
        la comprobación.
      </div>
    `;

    return;
  }


  // ------------------------------------------
  // NO ESTÁ EN ALTA
  // ------------------------------------------

  if (alta === "no") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Necesitamos revisar tu situación
        </strong>

        <p>
          La prestación contributiva exige estar
          en alta o en una situación asimilada al alta.
        </p>

        <p>
          Que hayas respondido "no" no significa
          automáticamente que no tengas ningún derecho.
          Algunas situaciones se consideran asimiladas al alta.
        </p>

        ${enlaceSeguridadSocialNacimiento()}

      </div>
    `;

    return;
  }


  if (alta === "duda") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Primero debemos confirmar tu situación de alta
        </strong>

        <p>
          Para determinar correctamente la prestación,
          comprueba tu situación actual en la Seguridad Social.
        </p>

        ${enlaceSeguridadSocialNacimiento()}

      </div>
    `;

    return;
  }


  // ------------------------------------------
  // MENOR DE 21
  // ------------------------------------------

  if (edad < 21) {

    mostrarNacimientoPositivo(resultado);

    return;
  }


  // ------------------------------------------
  // ENTRE 21 Y 25
  // ------------------------------------------

  if (edad >= 21 && edad < 26) {

    if (
      cotizacion === "90_179" ||
      cotizacion === "180_359" ||
      cotizacion === "360omas"
    ) {

      mostrarNacimientoPositivo(resultado);

    } else {

      mostrarNacimientoCotizacionDudosa(
        resultado,
        "Para tu edad se exigen 90 días cotizados en los últimos 7 años o, alternativamente, 180 días a lo largo de la vida laboral."
      );

    }

    return;
  }


  // ------------------------------------------
  // 26 AÑOS O MÁS
  // ------------------------------------------

  if (edad >= 26) {

    if (
      cotizacion === "180_359" ||
      cotizacion === "360omas"
    ) {

      mostrarNacimientoPositivo(resultado);

    } else {

      mostrarNacimientoCotizacionDudosa(
        resultado,
        "Para tu edad se exigen 180 días cotizados en los últimos 7 años o, alternativamente, 360 días a lo largo de la vida laboral."
      );

    }

  }
}


// ==========================================
// RESULTADO POSITIVO
// ==========================================

function mostrarNacimientoPositivo(resultado) {

  const semanas =
    respuestas.monoparental
      ? 32
      : 19;

  resultado.innerHTML = `
    <div class="resultado-si">

      <div class="resultado-icono">
        👶
      </div>

      <strong>
        Por tus respuestas, parece que cumples
        los requisitos básicos
      </strong>

      <p>
        Para un nacimiento actual, el permiso es de
        <strong>${semanas} semanas</strong>
        ${respuestas.monoparental
          ? "en situación de monoparentalidad."
          : "por progenitor."}
      </p>

      <p>
        💰 La prestación económica equivale al
        <strong>100 % de la base reguladora</strong>.
      </p>

      <div class="consejo">
        💡 La Seguridad Social dispone de un simulador
        oficial con el que puedes calcular tu prestación.
      </div>

      ${enlaceSeguridadSocialNacimiento()}

    </div>
  `;
}


// ==========================================
// COTIZACIÓN INSUFICIENTE / DUDOSA
// ==========================================

function mostrarNacimientoCotizacionDudosa(
  resultado,
  requisito
) {

  resultado.innerHTML = `
    <div class="resultado-duda">

      <strong>
        ⚠️ Tenemos que comprobar tu cotización
      </strong>

      <p>
        ${requisito}
      </p>

      <p>
        Con la información introducida no podemos
        confirmar la prestación contributiva.
      </p>

      <p>
        <strong>Importante:</strong>
        si no alcanzas la cotización mínima,
        podría existir el subsidio especial
        no contributivo por nacimiento y cuidado
        del menor.
      </p>

      ${enlaceSeguridadSocialNacimiento()}

    </div>
  `;
}


// ==========================================
// ENLACE OFICIAL
// ==========================================

function enlaceSeguridadSocialNacimiento() {

  return `
    <a
      href="${enlacesOficiales.prestacionNacimiento}"
      target="_blank"
      rel="noopener noreferrer"
      class="enlace-oficial"
    >
      Comprobar y solicitar en la Seguridad Social →
    </a>
  `;
}
// ==========================================
// EVALUADOR AYUDA CATALUÑA 2026
// ==========================================

function abrirEvaluadorCataluna() {

  const contenedor =
    document.getElementById("evaluadorCataluna");

  if (!contenedor) return;

  contenedor.style.display = "block";

  contenedor.innerHTML = `
    <div class="evaluador">

      <h4>
        Vamos a comprobarlo
      </h4>

      <p>
        Solo necesitamos algunos datos más.
        No se envían a ningún servidor.
      </p>


      <label class="campo-evaluador">

        <strong>
          ¿Cuántas personas forman vuestra unidad familiar?
        </strong>

        <span>
          Incluye progenitores, bebé y otros hijos
          que formen parte de la unidad familiar.
        </span>

        <select id="miembrosFamilia">

          <option value="">
            Selecciona
          </option>

          <option value="2">2 personas</option>
          <option value="3">3 personas</option>
          <option value="4">4 personas</option>
          <option value="5">5 personas</option>
          <option value="6">6 personas</option>
          <option value="7">7 personas</option>
          <option value="8">8 personas</option>
          <option value="9">9 personas</option>
          <option value="10">10 personas</option>

        </select>

      </label>


      <label class="campo-evaluador">

        <strong>
          Ingresos anuales de la unidad familiar
        </strong>

        <span>
          Introduce el importe aproximado en euros.
          Después deberás verificar el cálculo oficial.
        </span>

        <input
          type="number"
          id="ingresosFamilia"
          min="0"
          step="100"
          placeholder="Ej. 25000"
        >

      </label>


      <label class="campo-evaluador">

        <strong>
          ¿Algún miembro tiene una discapacidad
          igual o superior al 33 %?
        </strong>

        <select id="discapacidad33">

          <option value="">
            Selecciona
          </option>

          <option value="no">
            No
          </option>

          <option value="si">
            Sí
          </option>

        </select>

      </label>


      <label class="campo-evaluador">

        <strong>
          ¿Tenéis título vigente de familia numerosa
          o monoparental?
        </strong>

        <select id="tituloEspecial">

          <option value="">
            Selecciona
          </option>

          <option value="no">
            No
          </option>

          <option value="si">
            Sí
          </option>

        </select>

      </label>


      <label class="campo-evaluador">

        <strong>
          ¿Uno de los progenitores ha residido legalmente
          en Cataluña al menos 5 años, incluidos los
          2 inmediatamente anteriores?
        </strong>

        <select id="residenciaCataluna">

          <option value="">
            Selecciona
          </option>

          <option value="si">
            Sí
          </option>

          <option value="no">
            No
          </option>

          <option value="duda">
            No estoy seguro/a
          </option>

        </select>

      </label>


      <button
        type="button"
        onclick="evaluarAyudaCataluna()"
      >
        Ver resultado →
      </button>


      <div
        id="resultadoEvaluadorCataluna"
        style="margin-top:20px;"
      ></div>

    </div>
  `;

  contenedor.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}


// ==========================================
// LÍMITES DE INGRESOS 2026
// ==========================================

function obtenerLimiteCataluna(miembros) {

  const limites = {

    3: 27904.32,
    4: 36275.62,
    5: 44646.91,
    6: 53018.21,
    7: 61389.50,
    8: 69760.80,
    9: 78132.10,
    10: 86503.39

  };

  if (miembros <= 3) {
    return limites[3];
  }

  if (miembros >= 10) {
    return limites[10];
  }

  return limites[miembros];
}


// ==========================================
// CALCULAR ELEGIBILIDAD
// ==========================================

function evaluarAyudaCataluna() {

  const miembros =
    Number(document.getElementById("miembrosFamilia").value);

  const ingresos =
    Number(document.getElementById("ingresosFamilia").value);

  const discapacidad =
    document.getElementById("discapacidad33").value;

  const titulo =
    document.getElementById("tituloEspecial").value;

  const residencia =
    document.getElementById("residenciaCataluna").value;

  const resultado =
    document.getElementById("resultadoEvaluadorCataluna");


  if (
    !miembros ||
    document.getElementById("ingresosFamilia").value === "" ||
    !discapacidad ||
    !titulo ||
    !residencia
  ) {

    resultado.innerHTML = `
      <div class="resultado-duda">
        ⚠️ Completa todos los campos para poder hacer
        la comprobación.
      </div>
    `;

    return;
  }


  // ------------------------------------------
  // AJUSTAR NÚMERO DE MIEMBROS
  // ------------------------------------------

  let miembrosComputables = miembros;


  if (discapacidad === "si") {
    miembrosComputables++;
  }


  if (respuestas.monoparental) {

    miembrosComputables++;

    if (miembrosComputables < 4) {
      miembrosComputables = 4;
    }

  }


  const limite =
    obtenerLimiteCataluna(miembrosComputables);


  const cumpleIngresos =
    ingresos <= limite;


  const infoPlazo =
    calcularAyudaCataluna();


  // ------------------------------------------
  // IMPORTE
  // ------------------------------------------

  const importe =
    titulo === "si"
      ? 750
      : 650;


  // ------------------------------------------
  // PLAZO VENCIDO
  // ------------------------------------------

  if (infoPlazo.expirada) {

    resultado.innerHTML = `
      <div class="resultado-no">

        <strong>
          ⏰ El plazo ordinario parece haber terminado
        </strong>

        <p>
          Por la fecha de nacimiento que nos has indicado,
          el plazo ordinario calculado ya habría finalizado.
        </p>

        <p>
          Aun así, comprueba tu situación directamente
          con la Generalitat antes de descartarla.
        </p>

      </div>
    `;

    return;
  }


  // ------------------------------------------
  // RESIDENCIA
  // ------------------------------------------

  if (residencia === "no") {

    resultado.innerHTML = `
      <div class="resultado-no">

        <strong>
          ❌ En principio no cumplirías el requisito
          general de residencia
        </strong>

        <p>
          La Generalitat exige residencia legal en Cataluña
          y, con carácter general, que uno de los progenitores
          haya residido legalmente al menos 5 años,
          incluidos los 2 inmediatamente anteriores.
        </p>

        <p>
          Existen determinadas excepciones, por lo que
          conviene comprobar la fuente oficial si tu situación
          es especial.
        </p>

      </div>
    `;

    return;
  }


  // ------------------------------------------
  // INGRESOS SUPERIORES
  // ------------------------------------------

  if (!cumpleIngresos) {

    resultado.innerHTML = `
      <div class="resultado-no">

        <strong>
          ❌ Por los datos introducidos,
          parece que superáis el límite de ingresos
        </strong>

        <p>
          Para vuestra situación hemos calculado
          un límite aproximado de:
        </p>

        <div class="numero-grande">
          ${formatearEuros(limite)}
        </div>

        <p>
          Has indicado unos ingresos de
          <strong>${formatearEuros(ingresos)}</strong>.
        </p>

        <p>
          Verifica siempre el cálculo definitivo
          con la Generalitat.
        </p>

      </div>
    `;

    return;
  }


  // ------------------------------------------
  // RESIDENCIA DUDOSA
  // ------------------------------------------

  if (residencia === "duda") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Económicamente parece que encajáis
        </strong>

        <p>
          El límite calculado para vuestra situación es
          <strong>${formatearEuros(limite)}</strong>
          y habéis indicado
          <strong>${formatearEuros(ingresos)}</strong>.
        </p>

        <p>
          Pero necesitamos que confirmes el requisito
          de residencia antes de considerar que
          probablemente tienes derecho.
        </p>

      </div>
    `;

    return;
  }


  // ------------------------------------------
  // RESULTADO POSITIVO
  // ------------------------------------------

  resultado.innerHTML = `
    <div class="resultado-si">

      <div class="resultado-icono">
        💰
      </div>

      <div>

        <strong>
          Por tus respuestas, parece que podrías
          solicitar ${importe} €
        </strong>

        <p>
          Vuestros ingresos indicados:
          <strong>${formatearEuros(ingresos)}</strong>
        </p>

        <p>
          Límite calculado:
          <strong>${formatearEuros(limite)}</strong>
        </p>

        <p>
          ${infoPlazo.mensaje}
        </p>

        <a
          href="${enlacesOficiales.ayudaCataluna}"
          target="_blank"
          rel="noopener noreferrer"
          class="enlace-oficial"
        >
          Solicitar en la Generalitat →
        </a>

      </div>

    </div>
  `;
}


// ==========================================
// FORMATO €
// ==========================================

function formatearEuros(numero) {

  return new Intl.NumberFormat(
    "es-ES",
    {
      style: "currency",
      currency: "EUR"
    }
  ).format(numero);
}
// ==========================================
// GUARDAR TRÁMITES COMPLETADOS
// ==========================================

function cambiarEstadoTramite(checkbox) {

  const completados = obtenerTramitesCompletados();

  const id = checkbox.dataset.id;

  if (checkbox.checked) {

    if (!completados.includes(id)) {
      completados.push(id);
    }

  } else {

    const posicion = completados.indexOf(id);

    if (posicion !== -1) {
      completados.splice(posicion, 1);
    }

  }

  localStorage.setItem(
    "tramitesFacilesCompletados",
    JSON.stringify(completados)
  );

  actualizarAspectoTramite(checkbox);
  actualizarContador();
}


function obtenerTramitesCompletados() {

  try {

    return JSON.parse(
      localStorage.getItem("tramitesFacilesCompletados")
    ) || [];

  } catch {

    return [];

  }
}


function restaurarTramitesCompletados() {

  const completados = obtenerTramitesCompletados();

  document.querySelectorAll(".checkTramite").forEach(
    checkbox => {

      if (completados.includes(checkbox.dataset.id)) {
        checkbox.checked = true;
      }

      actualizarAspectoTramite(checkbox);
    }
  );
}


// ==========================================
// ASPECTO COMPLETADO
// ==========================================

function actualizarAspectoTramite(checkbox) {

  const tarjeta = checkbox.closest(".tramite");

  if (!tarjeta) return;


  if (checkbox.checked) {

    tarjeta.style.opacity = "0.65";
    tarjeta.style.background = "#f8fafc";

  } else {

    tarjeta.style.opacity = "1";
    tarjeta.style.background = "white";

  }
}


// ==========================================
// CONTADOR DE PROGRESO
// ==========================================

function actualizarContador() {

  const checks = document.querySelectorAll(".checkTramite");

  const completados = document.querySelectorAll(
    ".checkTramite:checked"
  );

  const contador = document.getElementById(
    "contadorProgreso"
  );

  if (!contador) return;

  contador.textContent =
    `${completados.length} de ${checks.length} trámites completados`;

  if (
    checks.length > 0 &&
    completados.length === checks.length
  ) {

    contador.textContent =
      `🎉 ¡Checklist completada! ${checks.length} de ${checks.length}`;

  }
}


// ==========================================
// FECHAS
// ==========================================

function crearFechaLocal(fecha) {

  if (!fecha) return null;

  const partes = fecha.split("-");

  if (partes.length !== 3) return null;

  return new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2])
  );
}


function sumarMesesConReglaFinMes(fecha, meses) {

  const diaOriginal = fecha.getDate();

  const resultado = new Date(
    fecha.getFullYear(),
    fecha.getMonth() + meses,
    1
  );

  const ultimoDiaMesDestino = new Date(
    resultado.getFullYear(),
    resultado.getMonth() + 1,
    0
  ).getDate();

  resultado.setDate(
    Math.min(diaOriginal, ultimoDiaMesDestino)
  );

  resultado.setHours(23, 59, 59, 999);

  return resultado;
}


function formatearFecha(fecha) {

  if (!fecha) return "";

  const partes = fecha.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function formatearFechaObjeto(fecha) {

  return fecha.toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );
}


// ==========================================
// NAVEGACIÓN
// ==========================================

function volverPortada() {

  if (window.location.pathname.startsWith("/checklist")) {
    window.location.href = "/";
    return;
  }

  document.getElementById("cuestionario").style.display =
    "none";

  document.getElementById("resultado").style.display =
    "none";

  document.getElementById("portada").style.display =
    "block";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function reiniciarCuestionario() {

  document.getElementById("resultado").style.display =
    "none";

  document.getElementById("cuestionario").style.display =
    "block";

  mostrarPaso1();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==========================================
// GUARDAR RESPUESTAS
// ==========================================

function guardarProgreso() {

  localStorage.setItem(
    "tramitesFacilesRespuestas",
    JSON.stringify(respuestas)
  );
}
// ==========================================
// EVALUADOR DEDUCCIÓN POR MATERNIDAD
// ==========================================

function abrirEvaluadorMaternidad() {

  const contenedor =
    document.getElementById("evaluadorMaternidad");

  if (!contenedor) return;

  contenedor.style.display = "block";

  contenedor.innerHTML = `
    <div class="evaluador">

      <h4>Comprobemos esta deducción</h4>

      <p>
        Solo necesitamos saber qué situación existía
        cuando nació el bebé.
      </p>


      <label class="campo-evaluador">

        <strong>
          ¿Quién está comprobando la deducción?
        </strong>

        <select id="personaMaternidad">

          <option value="">
            Selecciona
          </option>

          <option value="madre">
            Madre
          </option>

          <option value="otro">
            Otro progenitor o tutor
          </option>

        </select>

      </label>


      <label class="campo-evaluador">

        <strong>
          En el momento del nacimiento,
          ¿cuál era tu situación?
        </strong>

        <select id="situacionMaternidad">

          <option value="">
            Selecciona
          </option>

          <option value="alta">
            De alta en Seguridad Social o mutualidad
          </option>

          <option value="desempleo">
            Cobrando prestación contributiva o
            asistencial por desempleo
          </option>

          <option value="ninguna">
            Ninguna de las anteriores
          </option>

          <option value="duda">
            No estoy seguro/a
          </option>

        </select>

      </label>
      <label class="campo-evaluador">

  <strong>
    ¿Alguno de los progenitores cobra por este bebé
    el complemento de ayuda para la infancia del
    Ingreso Mínimo Vital?
  </strong>

  <select id="complementoInfancia">

    <option value="">
      Selecciona
    </option>

    <option value="no">
      No
    </option>

    <option value="si">
      Sí
    </option>

    <option value="duda">
      No estoy seguro/a
    </option>

  </select>

</label>


      <button
        type="button"
        onclick="evaluarDeduccionMaternidad()"
      >
        Ver resultado →
      </button>


      <div
        id="resultadoMaternidad"
        style="margin-top:20px;"
      ></div>

    </div>
  `;
}


// ==========================================
// EVALUAR DEDUCCIÓN
// ==========================================
function evaluarDeduccionMaternidad() {

  const persona =
    document.getElementById("personaMaternidad").value;

  const situacion =
    document.getElementById("situacionMaternidad").value;

  const complementoInfancia =
    document.getElementById("complementoInfancia").value;

  const resultado =
    document.getElementById("resultadoMaternidad");


  // ==========================================
  // COMPROBAR QUE TODO ESTÁ CONTESTADO
  // ==========================================

  if (!persona || !situacion || !complementoInfancia) {

    resultado.innerHTML = `
      <div class="resultado-duda">
        ⚠️ Completa todas las preguntas.
      </div>
    `;

    return;
  }


  // ==========================================
  // COMPLEMENTO DE AYUDA PARA LA INFANCIA
  // ==========================================

  if (complementoInfancia === "si") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Hay que revisar este caso
        </strong>

        <p>
          El complemento de ayuda para la infancia
          del Ingreso Mínimo Vital puede afectar
          al derecho a la deducción por maternidad
          durante los mismos meses.
        </p>

        <p>
          Existen excepciones, por lo que no vamos
          a decirte automáticamente que no tienes derecho.
        </p>

        ${enlaceMaternidadAEAT()}

      </div>
    `;

    return;
  }


  if (complementoInfancia === "duda") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Necesitamos comprobar un dato
        </strong>

        <p>
          Confirma si alguno de los progenitores
          está cobrando por este menor el complemento
          de ayuda para la infancia del
          Ingreso Mínimo Vital.
        </p>

        ${enlaceMaternidadAEAT()}

      </div>
    `;

    return;
  }


  // ==========================================
  // OTRO PROGENITOR O TUTOR
  // ==========================================

  if (persona === "otro") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Hay que revisar quién tiene derecho
        </strong>

        <p>
          Esta deducción corresponde con carácter general
          a la madre que cumple los requisitos.
        </p>

        <p>
          Existen determinados casos en los que puede
          aplicarla otro progenitor o tutor, por ejemplo
          algunas situaciones de adopción, fallecimiento
          o guarda y custodia exclusiva.
        </p>

        ${enlaceMaternidadAEAT()}

      </div>
    `;

    return;
  }


  // ==========================================
  // ALTA EN SEGURIDAD SOCIAL
  // ==========================================

  if (situacion === "alta") {

    mostrarMaternidadPositiva(resultado);

    return;
  }


  // ==========================================
  // PRESTACIÓN POR DESEMPLEO
  // ==========================================

  if (situacion === "desempleo") {

    mostrarMaternidadPositiva(resultado);

    return;
  }


  // ==========================================
  // NO CUMPLÍA REQUISITOS AL NACIMIENTO
  // ==========================================

  if (situacion === "ninguna") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Todavía podrías generar el derecho
        </strong>

        <p>
          Aunque no cumplieras esos requisitos
          en el momento del nacimiento,
          puedes generar posteriormente el derecho
          si te das de alta en la Seguridad Social
          o mutualidad y alcanzas el período mínimo
          de cotización exigido.
        </p>

        <p>
          Actualmente ese período mínimo es de
          <strong>30 días cotizados</strong>.
        </p>

        ${enlaceMaternidadAEAT()}

      </div>
    `;

    return;
  }


  // ==========================================
  // NO SABE SU SITUACIÓN
  // ==========================================

  if (situacion === "duda") {

    resultado.innerHTML = `
      <div class="resultado-duda">

        <strong>
          ⚠️ Necesitamos confirmar tu situación
        </strong>

        <p>
          Consulta si en el momento del nacimiento estabas
          de alta en Seguridad Social o mutualidad,
          o percibiendo una prestación contributiva
          o asistencial por desempleo.
        </p>

        ${enlaceMaternidadAEAT()}

      </div>
    `;

    return;
  }
}

// ==========================================
// RESULTADO POSITIVO
// ==========================================

function mostrarMaternidadPositiva(resultado) {

  resultado.innerHTML = `
    <div class="resultado-si">

      <div class="resultado-icono">
        💶
      </div>

      <strong>
        Por tus respuestas, parece que podrías
        tener derecho a la deducción
      </strong>

      <div class="numero-grande">
        Hasta 1.200 € al año
      </div>

      <p>
        La deducción puede alcanzar
        <strong>100 € por cada mes</strong>
        en que se cumplan los requisitos,
        hasta que el menor alcance la edad establecida.
      </p>

      <div class="consejo">

        💡 Puedes aplicarla en la declaración de IRPF
        o solicitar el abono anticipado mediante
        el <strong>modelo 140</strong> cuando corresponda.

      </div>

      ${enlaceMaternidadAEAT()}

    </div>
  `;
}


// ==========================================
// ENLACE AEAT
// ==========================================

function enlaceMaternidadAEAT() {

  return `
    <a
      href="${enlacesOficiales.maternidad}"
      target="_blank"
      rel="noopener noreferrer"
      class="enlace-oficial"
    >
      Comprobar en la Agencia Tributaria →
    </a>
  `;
}

// ============================================================================
// PAPELES DEL BEBÉ — CAPA ESPAÑA (08/10/2026)
// ============================================================================

const datosComunidadesPapelesBebe = {
  "Andalucía": {
    "slug": "andalucia",
    "salud": "https://www.juntadeandalucia.es/temas/salud/servicios/tarjeta.html",
    "salud_nombre": "Servicio Andaluz de Salud",
    "familias": "https://www.juntadeandalucia.es/organismos/serviciossocialesfamiliaseigualdad/areas/familias.html",
    "familias_nombre": "Junta de Andalucía"
  },
  "Aragón": {
    "slug": "aragon",
    "salud": "https://www.saludinforma.es/",
    "salud_nombre": "Salud Informa Aragón",
    "familias": "https://www.aragon.es/temas/familias",
    "familias_nombre": "Gobierno de Aragón"
  },
  "Asturias": {
    "slug": "asturias",
    "salud": "https://www.astursalud.es/",
    "salud_nombre": "AsturSalud",
    "familias": "https://socialasturias.asturias.es/",
    "familias_nombre": "Principado de Asturias"
  },
  "Islas Baleares": {
    "slug": "islas-baleares",
    "salud": "https://www.ibsalut.es/",
    "salud_nombre": "IB-SALUT",
    "familias": "https://www.caib.es/",
    "familias_nombre": "Govern de les Illes Balears"
  },
  "Canarias": {
    "slug": "canarias",
    "salud": "https://www3.gobiernodecanarias.org/sanidad/scs/",
    "salud_nombre": "Servicio Canario de la Salud",
    "familias": "https://www.gobiernodecanarias.org/derechossociales/",
    "familias_nombre": "Gobierno de Canarias"
  },
  "Cantabria": {
    "slug": "cantabria",
    "salud": "https://saludcantabria.es/",
    "salud_nombre": "Servicio Cántabro de Salud",
    "familias": "https://www.serviciossocialescantabria.org/",
    "familias_nombre": "Gobierno de Cantabria"
  },
  "Castilla-La Mancha": {
    "slug": "castilla-la-mancha",
    "salud": "https://sanidad.castillalamancha.es/",
    "salud_nombre": "SESCAM",
    "familias": "https://www.castillalamancha.es/gobierno/bienestarsocial",
    "familias_nombre": "Junta de Comunidades de Castilla-La Mancha"
  },
  "Castilla y León": {
    "slug": "castilla-y-leon",
    "salud": "https://www.saludcastillayleon.es/",
    "salud_nombre": "Sacyl",
    "familias": "https://familia.jcyl.es/",
    "familias_nombre": "Junta de Castilla y León"
  },
  "Cataluña": {
    "slug": "cataluna",
    "salud": "https://canalsalut.gencat.cat/",
    "salud_nombre": "CatSalut",
    "familias": "https://web.gencat.cat/es/ciutadania/societat-ciutadania-families/tenir-una-criatura",
    "familias_nombre": "Generalitat de Catalunya"
  },
  "Comunidad Valenciana": {
    "slug": "comunidad-valenciana",
    "salud": "https://www.san.gva.es/es/web/tarjeta-sanitaria/tarjeta-sanitaria-individual",
    "salud_nombre": "Conselleria de Sanidad",
    "familias": "https://serviciossociales.gva.es/",
    "familias_nombre": "Generalitat Valenciana"
  },
  "Extremadura": {
    "slug": "extremadura",
    "salud": "https://saludextremadura.ses.es/",
    "salud_nombre": "Servicio Extremeño de Salud",
    "familias": "https://www.juntaex.es/",
    "familias_nombre": "Junta de Extremadura"
  },
  "Galicia": {
    "slug": "galicia",
    "salud": "https://www.sergas.es/",
    "salud_nombre": "SERGAS",
    "familias": "https://sede.xunta.gal/detalle-procedemento?ano=2026&codtram=BS403B&lang=es&numpub=1",
    "familias_nombre": "Xunta de Galicia"
  },
  "Comunidad de Madrid": {
    "slug": "comunidad-de-madrid",
    "salud": "https://www.comunidad.madrid/salud/tarjeta-sanitaria",
    "salud_nombre": "Servicio Madrileño de Salud",
    "familias": "https://www.comunidad.madrid/servicios/servicios-sociales/familias",
    "familias_nombre": "Comunidad de Madrid"
  },
  "Región de Murcia": {
    "slug": "region-de-murcia",
    "salud": "https://www.murciasalud.es/",
    "salud_nombre": "MurciaSalud",
    "familias": "https://www.carm.es/",
    "familias_nombre": "Región de Murcia"
  },
  "Navarra": {
    "slug": "navarra",
    "salud": "https://www.navarra.es/es/salud",
    "salud_nombre": "Gobierno de Navarra - Salud",
    "familias": "https://www.navarra.es/es/derechos-sociales/familia",
    "familias_nombre": "Gobierno de Navarra"
  },
  "País Vasco": {
    "slug": "pais-vasco",
    "salud": "https://www.osakidetza.euskadi.eus/",
    "salud_nombre": "Osakidetza",
    "familias": "https://www.euskadi.eus/familia/",
    "familias_nombre": "Gobierno Vasco"
  },
  "La Rioja": {
    "slug": "la-rioja",
    "salud": "https://www.riojasalud.es/",
    "salud_nombre": "Rioja Salud",
    "familias": "https://www.larioja.org/servicios-sociales/es",
    "familias_nombre": "Gobierno de La Rioja"
  },
  "Ceuta": {
    "slug": "ceuta",
    "salud": "https://ingesa.sanidad.gob.es/",
    "salud_nombre": "INGESA",
    "familias": "https://www.ceuta.es/",
    "familias_nombre": "Ciudad Autónoma de Ceuta"
  },
  "Melilla": {
    "slug": "melilla",
    "salud": "https://ingesa.sanidad.gob.es/",
    "salud_nombre": "INGESA",
    "familias": "https://www.melilla.es/",
    "familias_nombre": "Ciudad Autónoma de Melilla"
  }
};

function obtenerDatosComunidadPapelesBebe() {
  return datosComunidadesPapelesBebe[respuestas.comunidad] || null;
}

const generarTramitesBasePapelesBebe = generarTramites;
const crearContenidoGuiaBasePapelesBebe = crearContenidoGuia;

generarTramites = function() {
  const tramites = generarTramitesBasePapelesBebe();
  const datos = obtenerDatosComunidadPapelesBebe();
  if (!datos) return tramites;

  if (respuestas.comunidad !== "Cataluña") {
    tramites.push({
      id: "tarjeta-sanitaria-autonomica",
      prioridad: "IMPORTANTE",
      titulo: `Solicitar o comprobar la tarjeta sanitaria en ${respuestas.comunidad}`,
      descripcion: `Revisa el alta sanitaria del bebé y la tarjeta individual en el servicio de salud de ${respuestas.comunidad}.`,
      detalle: `El procedimiento concreto cambia según la comunidad. Te llevamos al portal oficial de ${datos.salud_nombre}.`,
      enlace: datos.salud,
      textoEnlace: `Ir a ${datos.salud_nombre} →`
    });
  }

  if (respuestas.comunidad !== "Cataluña") {
    let titulo = `Revisar ayudas y programas para familias en ${respuestas.comunidad}`;
    let descripcion = "Además de las prestaciones estatales, tu comunidad puede tener ayudas, deducciones, títulos o programas propios para familias.";

    if (respuestas.comunidad === "Galicia") {
      titulo = "Comprobar la Tarxeta Benvida de Galicia";
      descripcion = "Galicia mantiene en 2026 el programa Tarxeta Benvida para apoyo a la natalidad. Comprueba requisitos, importes y plazo en la sede oficial.";
    }

    if (respuestas.comunidad === "Andalucía" && respuestas.nacimientoMultiple) {
      titulo = "Comprobar las ayudas andaluzas por parto múltiple";
      descripcion = "Andalucía contempla ayudas específicas para partos múltiples sujetas a requisitos e ingresos. Revisa tu caso en la fuente oficial.";
    }

    tramites.push({
      id: "ayudas-autonomicas",
      prioridad: "💰 REVISAR",
      titulo,
      descripcion,
      detalle: "Las convocatorias y requisitos autonómicos pueden cambiar. Por eso no damos por hecho que tengas derecho: compruébalo en el portal oficial enlazado.",
      enlace: datos.familias,
      textoEnlace: `Ver ayudas en ${datos.familias_nombre} →`
    });
  }

  return tramites;
};

crearContenidoGuia = function(tramite) {
  if (tramite.id === "tarjeta-sanitaria-autonomica") {
    const datos = obtenerDatosComunidadPapelesBebe();
    return `
      <h4>🏥 Tarjeta sanitaria del bebé</h4>
      <p>
        Una vez reconocido el derecho a la asistencia sanitaria, revisa
        cómo completar el alta del bebé en el servicio sanitario de
        <strong>${respuestas.comunidad}</strong>.
      </p>
      <ol>
        <li>Comprueba primero el alta del bebé en la Seguridad Social.</li>
        <li>Entra en el portal sanitario oficial de tu comunidad.</li>
        <li>Revisa si la tarjeta se genera automáticamente o debes solicitarla.</li>
        <li>Comprueba también la asignación de pediatra y centro de salud.</li>
      </ol>
      <div class="consejo">
        💡 Los documentos y el procedimiento no son idénticos en toda España.
        Utiliza siempre la información del servicio de salud autonómico.
      </div>
      <a href="${datos.salud}" target="_blank" rel="noopener noreferrer" class="enlace-oficial">
        Ir a ${datos.salud_nombre} →
      </a>
    `;
  }

  if (tramite.id === "ayudas-autonomicas") {
    const datos = obtenerDatosComunidadPapelesBebe();
    let extra = "";

    if (respuestas.comunidad === "Galicia") {
      extra = `
        <div class="caja-dinero">
          <div class="caja-dinero-icono">💳</div>
          <div>
            <strong>Tarxeta Benvida 2026</strong>
            <p>
              La convocatoria 2026 incluye nacimientos de 2026 y mantiene
              abierta la solicitud hasta el 31 de marzo de 2027.
              Comprueba en la Xunta el importe que corresponde a tu caso.
            </p>
          </div>
        </div>`;
    }

    if (respuestas.comunidad === "Andalucía" && respuestas.nacimientoMultiple) {
      extra = `
        <div class="caja-dinero">
          <div class="caja-dinero-icono">💰</div>
          <div>
            <strong>Ayuda andaluza por parto múltiple</strong>
            <p>
              La Junta publica ayudas específicas por parto múltiple,
              condicionadas por renta y otros requisitos. El plazo general
              publicado es de un año desde el nacimiento.
            </p>
          </div>
        </div>`;
    }

    return `
      <h4>💰 Ayudas de ${respuestas.comunidad}</h4>
      <p>
        Esta revisión es adicional a las prestaciones estatales que ya
        aparecen en tu checklist.
      </p>
      ${extra}
      <ol>
        <li>Abre el portal oficial de familias de tu comunidad.</li>
        <li>Busca ayudas por nacimiento, conciliación, familia numerosa o monoparental.</li>
        <li>Comprueba convocatoria, renta, residencia y plazo.</li>
        <li>Solicita únicamente desde la sede electrónica oficial.</li>
      </ol>
      <div class="aviso-importante">
        ⚠️ Las ayudas autonómicas cambian con más frecuencia que los trámites
        estatales. Papeles del Bebé te orienta, pero la resolución oficial
        depende de la administración competente.
      </div>
      <a href="${datos.familias}" target="_blank" rel="noopener noreferrer" class="enlace-oficial">
        Ver portal oficial de ${respuestas.comunidad} →
      </a>
    `;
  }

  return crearContenidoGuiaBasePapelesBebe(tramite);
};


// ============================================================================
// PERSISTENCIA Y REANUDACIÓN — V4
// ============================================================================

function cargarProgresoGuardado() {
  try {
    const guardado = JSON.parse(
      localStorage.getItem("tramitesFacilesRespuestas")
    );

    if (!guardado || typeof guardado !== "object") return;

    Object.keys(respuestas).forEach(clave => {
      if (Object.prototype.hasOwnProperty.call(guardado, clave)) {
        respuestas[clave] = guardado[clave];
      }
    });
  } catch (error) {
    // Si el navegador tiene datos corruptos, simplemente no los usamos.
  }
}

function hayProgresoGuardado() {
  return Boolean(
    respuestas.comunidad ||
    respuestas.fechaNacimiento ||
    respuestas.situacionLaboral ||
    respuestas.monoparental !== null ||
    respuestas.nacimientoMultiple !== null ||
    respuestas.discapacidadProgenitor !== null
  );
}

function cuestionarioCompleto() {
  return Boolean(
    respuestas.comunidad &&
    respuestas.fechaNacimiento &&
    respuestas.situacionLaboral &&
    respuestas.monoparental !== null &&
    respuestas.nacimientoMultiple !== null &&
    respuestas.discapacidadProgenitor !== null
  );
}

function obtenerPasoPendiente() {
  if (!respuestas.comunidad) return 1;
  if (!respuestas.fechaNacimiento) return 2;
  if (!respuestas.situacionLaboral) return 3;
  if (respuestas.monoparental === null) return 4;
  if (respuestas.nacimientoMultiple === null) return 5;
  if (respuestas.discapacidadProgenitor === null) return 6;
  return 7;
}

function continuarProgreso() {
  document.getElementById("portada").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("cuestionario").style.display = "block";

  const paso = obtenerPasoPendiente();

  if (paso === 1) mostrarPaso1();
  if (paso === 2) mostrarPaso2();
  if (paso === 3) mostrarPaso3();
  if (paso === 4) mostrarPaso4();
  if (paso === 5) mostrarPaso5();
  if (paso === 6) mostrarPaso6();

  if (paso === 7) {
    document.getElementById("cuestionario").style.display = "none";
    mostrarResultadoProvisional();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function empezarDeNuevo() {
  localStorage.removeItem("tramitesFacilesRespuestas");
  localStorage.removeItem("tramitesFacilesCompletados");

  respuestas.comunidad = "";
  respuestas.fechaNacimiento = "";
  respuestas.situacionLaboral = "";
  respuestas.monoparental = null;
  respuestas.nacimientoMultiple = null;
  respuestas.discapacidadProgenitor = null;

  const reanudar = document.getElementById("reanudarProgreso");
  if (reanudar) reanudar.innerHTML = "";

  empezar();
}

function mostrarTarjetaReanudacion() {
  const contenedor = document.getElementById("reanudarProgreso");

  if (!contenedor || !hayProgresoGuardado()) return;

  let texto = "Tienes una checklist empezada en este navegador.";

  if (cuestionarioCompleto()) {
    texto = "Tu checklist anterior sigue guardada en este navegador.";
  } else {
    const paso = obtenerPasoPendiente();
    texto = `Dejaste la checklist a medias. Puedes continuar desde el paso ${paso} de 6.`;
  }

  contenedor.innerHTML = `
    <div class="reanudar-card">
      <div class="reanudar-icono">👋</div>

      <div class="reanudar-contenido">
        <strong>¿Continuamos donde lo dejaste?</strong>
        <p>${texto}</p>

        <div class="reanudar-botones">
          <button type="button" onclick="continuarProgreso()">
            Continuar mi checklist →
          </button>

          <button
            type="button"
            class="boton-secundario"
            onclick="empezarDeNuevo()"
          >
            Empezar de nuevo
          </button>
        </div>
      </div>
    </div>
  `;
}

function volverInicio() {
  document.getElementById("cuestionario").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("portada").style.display = "block";

  mostrarTarjetaReanudacion();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Desde V4, si ya hay progreso y el usuario pulsa el CTA principal,
// continuamos automáticamente en lugar de mandarle otra vez al paso 1.
const empezarOriginalPapelesBebe = empezar;

empezar = function() {
  if (hayProgresoGuardado()) {
    continuarProgreso();
    return;
  }

  empezarOriginalPapelesBebe();
};


document.addEventListener("DOMContentLoaded", function() {
  cargarProgresoGuardado();

  const params = new URLSearchParams(window.location.search);
  const comunidad = params.get("comunidad");

  if (comunidad && datosComunidadesPapelesBebe[comunidad]) {
    respuestas.comunidad = comunidad;
    guardarProgreso();
  }

  mostrarTarjetaReanudacion();

  if (params.get("empezar") === "1") {
    setTimeout(function() {
      empezar();
    }, 0);
  }
});


// ============================================================================
// V8 · FUNNEL MEDIBLE
// /checklist/              = inicio de checklist
// /checklist/completada/   = cuestionario completado
// ============================================================================

function irChecklist() {
  window.location.href = "/checklist/";
}

function irInicio() {
  window.location.href = "/";
}
