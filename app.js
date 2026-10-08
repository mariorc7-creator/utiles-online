// ==========================================
// TRÁMITES FÁCILES
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
      mostrarResultadoProvisional();
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
      </div>

    </div>

    <div id="listaTramites">
      ${tramites.map(crearTarjetaTramite).join("")}
    </div>

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
  actualizarContador();

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
        style="
          display:inline-block;
          margin-top:8px;
          color:#356ae6;
          font-weight:700;
          text-decoration:none;
        "
      >
        ${tramite.textoEnlace}
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

      <p style="font-size:14px;">
        ${tramite.detalle}
      </p>

      ${enlaceHTML}

      <div
        style="
          margin-top:20px;
          padding-top:18px;
          border-top:1px solid #edf0f4;
        "
      >

        <label
          style="
            display:flex;
            align-items:center;
            gap:10px;
            cursor:pointer;
            font-weight:700;
          "
        >

          <input
            type="checkbox"
            class="checkTramite"
            data-id="${tramite.id}"
            onchange="cambiarEstadoTramite(this)"
            style="
              width:20px;
              height:20px;
              accent-color:#356ae6;
            "
          >

          <span>
            Ya lo he hecho
          </span>

        </label>

      </div>

    </div>
  `;
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

  document.getElementById("cuestionario").style.display =
    "none";

  document.getElementById("resultado").style.display =
    "none";

  document.getElementById("portada").style.display =
    "block";
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

