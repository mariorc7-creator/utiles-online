// ==========================================
// TRÁMITES FÁCILES
// Cuestionario para nuevos padres
// ==========================================

const respuestas = {
  comunidad: "",
  situacionLaboral: "",
  monoparental: null,
  nacimientoMultiple: null,
  discapacidadProgenitor: null
};

let pasoActual = 1;


// ------------------------------------------
// EMPEZAR CUESTIONARIO
// ------------------------------------------

function empezar() {
  document.getElementById("portada").style.display = "none";
  document.getElementById("cuestionario").style.display = "block";

  mostrarPaso1();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ------------------------------------------
// PASO 1 - COMUNIDAD AUTÓNOMA
// ------------------------------------------

function mostrarPaso1() {

  pasoActual = 1;

  const cuestionario = document.getElementById("cuestionario");

  cuestionario.innerHTML = `
    <div class="progreso">
      PASO 1 DE 5
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


// ------------------------------------------
// PASO 2 - SITUACIÓN LABORAL
// ------------------------------------------

function mostrarPaso2() {

  pasoActual = 2;

  const cuestionario = document.getElementById("cuestionario");

  cuestionario.innerHTML = `
    <div class="progreso">
      PASO 2 DE 5
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

        <button class="volver" onclick="mostrarPaso1()">
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

  mostrarPaso3();
}


// ------------------------------------------
// PASO 3 - FAMILIA MONOPARENTAL
// ------------------------------------------

function mostrarPaso3() {

  pasoActual = 3;

  mostrarPreguntaSiNo(
    3,
    "¿Es una familia monoparental?",
    "Esta situación puede afectar a determinadas ayudas y prestaciones.",
    respuestas.monoparental,
    function(valor) {
      respuestas.monoparental = valor;
      guardarProgreso();
      mostrarPaso4();
    },
    mostrarPaso2
  );
}


// ------------------------------------------
// PASO 4 - NACIMIENTO MÚLTIPLE
// ------------------------------------------

function mostrarPaso4() {

  pasoActual = 4;

  mostrarPreguntaSiNo(
    4,
    "¿Ha sido un nacimiento múltiple?",
    "Por ejemplo, gemelos, mellizos o un parto de más bebés.",
    respuestas.nacimientoMultiple,
    function(valor) {
      respuestas.nacimientoMultiple = valor;
      guardarProgreso();
      mostrarPaso5();
    },
    mostrarPaso3
  );
}


// ------------------------------------------
// PASO 5 - DISCAPACIDAD
// ------------------------------------------

function mostrarPaso5() {

  pasoActual = 5;

  mostrarPreguntaSiNo(
    5,
    "¿Alguno de los progenitores tiene una discapacidad reconocida?",
    "Esta circunstancia puede afectar a determinadas prestaciones.",
    respuestas.discapacidadProgenitor,
    function(valor) {
      respuestas.discapacidadProgenitor = valor;
      guardarProgreso();
      mostrarResultadoProvisional();
    },
    mostrarPaso4
  );
}


// ------------------------------------------
// PREGUNTAS SÍ / NO
// ------------------------------------------

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
      PASO ${paso} DE 5
    </div>

    <div class="pregunta">

      <h2>${titulo}</h2>

      <p>${descripcion}</p>

      <div class="opciones">

        <label class="opcion" id="opcion-si">
          <input type="radio" name="respuestaSiNo" value="si">
          <div class="opcion-texto">
            <strong>Sí</strong>
          </div>
        </label>

        <label class="opcion" id="opcion-no">
          <input type="radio" name="respuestaSiNo" value="no">
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


// ------------------------------------------
// RESULTADO PROVISIONAL
// ------------------------------------------

function mostrarResultadoProvisional() {

  document.getElementById("cuestionario").style.display = "none";

  const resultado = document.getElementById("resultado");

  resultado.style.display = "block";

  resultado.innerHTML = `
    <div class="resultado-cabecera">

      <div class="badge">
        ✓ Cuestionario completado
      </div>

      <h2>Tu checklist está lista</h2>

      <p>
        Hemos guardado tus respuestas.
        El siguiente paso será mostrar aquí únicamente
        los trámites y ayudas que correspondan a tu situación.
      </p>

    </div>

    <div class="tramite">

      <span class="prioridad">
        PRÓXIMAMENTE
      </span>

      <h3>Checklist personalizada</h3>

      <p>
        Comunidad: <strong>${respuestas.comunidad}</strong>
      </p>

      <p>
        Estamos preparando la lógica de trámites basada
        en fuentes oficiales.
      </p>

    </div>

    <button onclick="reiniciarCuestionario()">
      Modificar mis respuestas
    </button>
  `;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ------------------------------------------
// NAVEGACIÓN
// ------------------------------------------

function volverPortada() {

  document.getElementById("cuestionario").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("portada").style.display = "block";
}


function reiniciarCuestionario() {

  document.getElementById("resultado").style.display = "none";
  document.getElementById("cuestionario").style.display = "block";

  mostrarPaso1();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ------------------------------------------
// GUARDAR PROGRESO EN EL NAVEGADOR
// ------------------------------------------

function guardarProgreso() {

  localStorage.setItem(
    "tramitesFacilesRespuestas",
    JSON.stringify(respuestas)
  );
}
