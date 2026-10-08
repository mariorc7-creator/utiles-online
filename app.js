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
        <h4>💰 Aquí puede haber dinero pendiente</h4>

        <p>
          Esta prestación sustituye los ingresos durante
          determinados periodos de descanso por nacimiento
          y cuidado del menor cuando se cumplen los requisitos.
        </p>

        <h4>Qué tienes que hacer</h4>

        <ol>
          <li>
            Comprueba que cumples los requisitos de afiliación,
            alta y cotización que correspondan.
          </li>

          <li>
            Revisa el periodo de descanso que te corresponde.
          </li>

          <li>
            Presenta la solicitud ante la Seguridad Social.
          </li>
        </ol>

        ${
          respuestas.monoparental
            ? `
              <div class="aviso-importante">
                👤 Has indicado que sois una familia monoparental.
                Revisa las reglas específicas de duración aplicables
                a tu situación.
              </div>
            `
            : ""
        }

        ${
          respuestas.nacimientoMultiple
            ? `
              <div class="aviso-importante">
                👶👶 Has indicado nacimiento múltiple.
                Comprueba las ampliaciones que puedan corresponderte.
              </div>
            `
            : ""
        }
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
        <h4>💰 Puede suponer hasta 100 € al mes anticipados</h4>

        <p>
          Cuando existe derecho a la deducción por maternidad,
          se puede solicitar su abono anticipado mediante
          el modelo 140.
        </p>

        <h4>Qué hacer</h4>

        <ol>
          <li>
            Comprueba primero si cumples los requisitos.
          </li>

          <li>
            Decide si quieres aplicarla posteriormente en IRPF
            o solicitar el abono anticipado.
          </li>

          <li>
            Para el abono anticipado, utiliza el modelo 140.
          </li>
        </ol>

        <div class="consejo">
          💡 Si ya percibías el abono anticipado por este mismo hijo,
          la AEAT indica que no debes presentar otra solicitud.
        </div>
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

