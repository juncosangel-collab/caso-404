const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyp5Ew24ThPgnVmrP9gy5tRgHTPsDen4SptbTzR_KSqqUT--r0JkktunHFJHn3mfHtlmQ/exec";

const TOTAL = 1200;

let left = TOTAL;
let timer = null;
let current = 0;
let started = false;


/* =====================================================
   ESTADO DEL JUEGO
===================================================== */

const S = {

  group: "",
  members: "",
  startAt: null,

  analysisOrder: [],
  analysisScore: 0,

  evidence: [],
  cross: [],
  contr: [],

  hyp: null,
  hypEvidence: [],
  anomaly: "",

  questions: [],
  answers: [],

  update: null,

  actions: [],

  ethics: null,

  verdict: null,

  report: "",

  events: []

};


/* =====================================================
   FASE 01
   LOS HORARIOS EXISTEN SOLO INTERNAMENTE.
   NO SE MUESTRAN AL PARTICIPANTE.
===================================================== */

const timeline = [

  [
    "T1",
    "ACCESO",
    "Una cuenta inicia sesión desde un dispositivo conocido.",
    "08:07:14"
  ],

  [
    "T2",
    "ARCHIVO",
    "Se crea una copia local del material.",
    "08:11:42"
  ],

  [
    "T3",
    "MODIFICACIÓN",
    "Una copia registra una modificación de metadatos.",
    "08:16:03"
  ],

  [
    "T4",
    "PRIMER REENVÍO",
    "Aparece el primer registro de circulación del material.",
    "08:17:12"
  ],

  [
    "T5",
    "CAPTURA",
    "Se genera una captura recortada.",
    "08:24:51"
  ],

  [
    "T6",
    "SEGUNDA CADENA",
    "El material aparece posteriormente en otro grupo.",
    "08:31:08"
  ],

  [
    "T7",
    "ELIMINACIÓN",
    "La publicación original desaparece.",
    "08:47:33"
  ],

  [
    "T8",
    "ACUSACIÓN",
    "Comienzan acusaciones sin una prueba concluyente.",
    "09:05:19"
  ]

];


/* =====================================================
   EVIDENCIAS
===================================================== */

const evidence = [

  [
    "E-01",
    "Registro de acceso",
    "Cuenta conocida; no prueba quién tenía el dispositivo."
  ],

  [
    "E-02",
    "Captura recortada",
    "Sin contexto anterior ni posterior."
  ],

  [
    "E-03",
    "Log de publicación",
    "Publicación registrada 08:17:12."
  ],

  [
    "E-04",
    "Metadatos IMG-4491",
    "Modificada 08:16:03."
  ],

  [
    "E-05",
    "Mensaje reenviado",
    "Afirma recepción previa sin origen."
  ],

  [
    "E-06",
    "Testimonio espectador",
    "Vio circulación, no primer envío."
  ],

  [
    "E-07",
    "Registro de eliminación",
    "Original eliminado 08:47:33."
  ],

  [
    "E-08",
    "Comentario anónimo",
    "Acusa sin aportar prueba."
  ],

  [
    "E-09",
    "Horarios de actividad",
    "Actividad de varias cuentas 08:10–08:30."
  ],

  [
    "E-10",
    "Encuesta informal",
    "Mayoría cree que fue una persona."
  ],

  [
    "E-11",
    "Captura completa",
    "Conserva contexto y fecha."
  ],

  [
    "E-12",
    "Audio transcripto",
    "“Ya lo tenía otra gente cuando me llegó”."
  ],

  [
    "E-13",
    "Archivo secundario",
    "Copia sin metadatos verificables."
  ],

  [
    "E-14",
    "Registro de recepción",
    "Recepción 08:11:58."
  ],

  [
    "E-15",
    "Mensaje posterior",
    "Dice que recibió “recién” a las 08:19."
  ],

  [
    "E-16",
    "Cadena de reenvíos",
    "Tres saltos posteriores."
  ],

  [
    "E-17",
    "Captura supuestamente original",
    "Creación 08:11; modificación 08:26."
  ],

  [
    "E-18",
    "Registro institucional",
    "Confirma datos personales."
  ],

  [
    "E-19",
    "Hash de archivo",
    "No coincide con captura difundida."
  ],

  [
    "E-20",
    "Rumor verbal",
    "“Todos saben quién fue”."
  ],

  [
    "E-21",
    "Historial de edición",
    "Versión exportada tras primera circulación."
  ],

  [
    "E-22",
    "Captura de perfil",
    "Relaciona cuenta con grupo, no con publicación."
  ],

  [
    "E-23",
    "Eliminación local",
    "Copia eliminada 08:49."
  ],

  [
    "E-24",
    "Mensaje de advertencia",
    "Pide detener reenvíos antes del final de cadena."
  ]

];


/* =====================================================
   CRUCE
===================================================== */

const cross = [

  [
    "C1",
    "E-03 ↔ E-04",
    "Publicación y modificación deben cruzarse."
  ],

  [
    "C2",
    "E-14 ↔ E-03",
    "Recepción previa a publicación visible."
  ],

  [
    "C3",
    "E-16 ↔ E-07",
    "Cadena y eliminación deben compararse."
  ],

  [
    "C4",
    "E-11 ↔ E-02",
    "Completa contextualiza recortada."
  ],

  [
    "C5",
    "E-18 ↔ E-08",
    "Dato personal no vuelve prueba a una acusación."
  ],

  [
    "C6",
    "E-19 ↔ E-17",
    "Hash y metadatos pueden revelar versiones distintas."
  ],

  [
    "C7",
    "E-09 ↔ E-22",
    "Actividad/pertenencia no demuestra autoría."
  ],

  [
    "C8",
    "E-20 ↔ E-10",
    "Dos rumores no son evidencia sólida."
  ]

];


/* =====================================================
   CONTRADICCIONES
===================================================== */

const contr = [

  [
    "K1",
    "E-03 vs E-14",
    "Recepción antes de publicación registrada."
  ],

  [
    "K2",
    "E-17 vs E-04",
    "Tiempos incompatibles."
  ],

  [
    "K3",
    "E-15 vs E-12",
    "Recepción “recién” frente a circulación previa."
  ],

  [
    "K4",
    "E-22 vs E-03",
    "Perfil asociado no demuestra publicación."
  ],

  [
    "K5",
    "E-20 vs E-11",
    "Rumor identifica; captura completa no."
  ],

  [
    "K6",
    "E-19 vs E-13",
    "Hashes no permiten tratarlos como idénticos."
  ]

];


/* =====================================================
   HIPÓTESIS
===================================================== */

const hyps = [

  [
    "H-A",
    "AUTORÍA INDIVIDUAL",
    "Una persona explica casi toda la cadena."
  ],

  [
    "H-B",
    "ACCESO EXTERNO",
    "Material obtenido/manipulado desde fuera."
  ],

  [
    "H-C",
    "CADENA DE DIFUSIÓN",
    "Varias decisiones sucesivas producen el incidente."
  ],

  [
    "H-D",
    "EVIDENCIA INSUFICIENTE",
    "No puede construirse explicación responsable."
  ]

];


/* =====================================================
   INTERROGATORIO
===================================================== */

const sus = [

  [
    "S1",
    "OPERADOR A",
    "¿Qué dispositivo utilizaste?",
    "El registro coincide con un dispositivo conocido, pero no prueba quién lo manipulaba."
  ],

  [
    "S2",
    "OPERADOR B",
    "¿Cuándo recibiste el archivo?",
    "Dice 08:12; el registro asociado muestra 08:11:58."
  ],

  [
    "S3",
    "TESTIGO C",
    "¿Viste el primer envío?",
    "No. Lo vi cuando ya había sido reenviado."
  ],

  [
    "S4",
    "ADMINISTRADOR D",
    "¿Por qué se eliminó?",
    "Tras una advertencia sobre exposición de datos personales."
  ],

  [
    "S5",
    "REMITENTE E",
    "¿Quién entregó la copia?",
    "No puede identificarse públicamente sin corroboración."
  ]

];


/* =====================================================
   NUEVA INFORMACIÓN
===================================================== */

const updates = [

  [
    "U-A",
    "TRATAR COMO PRUEBA DEFINITIVA",
    "La nueva información parece confirmar una acusación previa."
  ],

  [
    "U-B",
    "ABRIR NUEVA LÍNEA",
    "La actualización revela una inconsistencia que obliga a revisar."
  ],

  [
    "U-C",
    "IGNORAR",
    "Llegó tarde y no debería afectar el caso."
  ],

  [
    "U-D",
    "PUBLICAR",
    "La comunidad debe conocer inmediatamente el nuevo dato."
  ]

];


/* =====================================================
   INTERVENCIÓN
===================================================== */

const actions = [

  [
    "A1",
    "PRESERVAR EVIDENCIAS",
    "Originales, cadena de custodia y acceso limitado."
  ],

  [
    "A2",
    "PUBLICAR NOMBRES",
    "Identificar públicamente a señalados."
  ],

  [
    "A3",
    "RESTRINGIR DIFUSIÓN",
    "Detener reenvíos sensibles y conservar acceso institucional."
  ],

  [
    "A4",
    "CAMPAÑA EDUCATIVA",
    "Verificación, contexto y reenvíos responsables."
  ],

  [
    "A5",
    "BORRAR TODO",
    "Eliminar pruebas para reducir circulación."
  ],

  [
    "A6",
    "DERIVAR INSTITUCIONALMENTE",
    "Entregar información necesaria a responsables."
  ],

  [
    "A7",
    "COMPARTIR CAPTURA COMPLETA",
    "Difundir evidencia completa."
  ],

  [
    "A8",
    "ACUSACIÓN PRIVADA",
    "Acusar directamente sin corroboración."
  ]

];


/* =====================================================
   ÉTICA
===================================================== */

const ethics = [

  [
    "ET-A",
    "PUBLICAR TODO",
    "Transparencia por encima de privacidad."
  ],

  [
    "ET-B",
    "OCULTAR NOMBRES Y PUBLICAR",
    "No identifica, pero mantiene material sensible circulando."
  ],

  [
    "ET-C",
    "MINIMIZAR DATOS Y DERIVAR",
    "Solo información necesaria, acceso restringido y canal institucional."
  ],

  [
    "ET-D",
    "ELIMINAR PRUEBAS",
    "Eliminar toda evidencia disponible."
  ]

];


/* =====================================================
   VEREDICTO
===================================================== */

const verdicts = [

  [
    "V-A",
    "CULPABLE ÚNICO",
    "Permite señalar públicamente a una persona."
  ],

  [
    "V-B",
    "CADENA RESPONSABLE",
    "Cadena de decisiones sin convertir sospecha en condena."
  ],

  [
    "V-C",
    "SIN INTERVENCIÓN",
    "La incertidumbre impide actuar."
  ],

  [
    "V-D",
    "BORRAR Y CERRAR",
    "Eliminar material y terminar investigación."
  ],

  [
    "V-E",
    "DERIVACIÓN CON PROTECCIÓN",
    "Intervenir institucionalmente preservando datos."
  ]

];


/* =====================================================
   REGISTRO
===================================================== */

function log(type, data = {}) {

  S.events.push({

    time: new Date().toISOString(),

    phase: current,

    type,

    data

  });

}


/* =====================================================
   INICIAR
===================================================== */

function startGame() {

  S.group =
    document.getElementById("group").value.trim();

  S.members =
    document.getElementById("members").value.trim();


  if (!S.group || !S.members) {

    alert(
      "Completen el nombre del grupo y los integrantes."
    );

    return;
  }


  S.startAt =
    new Date().toISOString();


  started = true;


  // Los 8 hechos se muestran inicialmente desordenados.
  // Los horarios siguen guardados internamente para evaluar el orden correcto.
  for (let i = timeline.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [timeline[i], timeline[j]] = [timeline[j], timeline[i]];
  }


  log("START");


  render();


  go(1);


  timer =
    setInterval(tick, 1000);

}


/* =====================================================
   TEMPORIZADOR
===================================================== */

function tick() {

  left =
    Math.max(0, left - 1);


  const m =
    Math.floor(left / 60);


  const s =
    left % 60;


  document.getElementById("timer").textContent =

    `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;


  if (left === 0) {

    clearInterval(timer);

    alert(
      "TIEMPO AGOTADO. Finalicen el protocolo con las decisiones que hayan tomado."
    );

  }

}


/* =====================================================
   CAMBIO DE FASE
===================================================== */

function go(n) {

  current = n;


  document
    .querySelectorAll(".screen")
    .forEach(x =>
      x.classList.remove("active")
    );


  const id =
    n === 0
      ? "start"
      : n === 11
        ? "finish"
        : `p${n}`;


  document
    .getElementById(id)
    .classList.add("active");


  const pct =

    n === 0
      ? 0
      : n === 11
        ? 100
        : ((n - 1) / 10) * 100;


  document
    .getElementById("progress")
    .style.width = `${pct}%`;


  document
    .getElementById("phaseLabel")
    .textContent =

      n === 11
        ? "FINALIZADO"
        : n === 0
          ? "PREPARACIÓN"
          : `FASE ${String(n).padStart(2,"0")}`;


  document
    .getElementById("phaseNumber")
    .textContent =

      n >= 1 && n <= 10
        ? `${n} / 10`
        : "";


  log("PHASE_OPEN", { n });


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =====================================================
   SELLAR FASE
===================================================== */

function seal(n) {

  if (n === 1) {

    calculateAnalysisScore();

    S.analysisOrder =
      timeline.map(x => x[0]);

  }


  if (n === 5) {

    S.anomaly =
      document
        .getElementById("anomaly")
        .value
        .trim();

  }


  log(

    "DECISION",

    {

      phase: n,

      snapshot:
        JSON.parse(
          JSON.stringify(S)
        )

    }

  );


  showPhaseToast(
    `FASE ${String(n).padStart(2,"0")} COMPLETADA`
  );


  setTimeout(

    () => go(n + 1),

    700

  );

}


/* =====================================================
   TOAST
===================================================== */

function showPhaseToast(message) {

  const toast =
    document.getElementById("phaseToast");


  if (!toast) return;


  toast.textContent =
    message;


  toast.classList.remove("show");


  void toast.offsetWidth;


  toast.classList.add("show");


  setTimeout(

    () =>
      toast.classList.remove("show"),

    700

  );

}


/* =====================================================
   TARJETAS
===================================================== */

function mk(
  container,
  a,
  fn,
  selected = false
) {

  const d =
    document.createElement("article");


  d.className =
    `choice${selected ? " selected" : ""}`;


  d.innerHTML = `

    <div class="choiceCode">
      ${a[0]}
    </div>

    <h3>
      ${a[1]}
    </h3>

    <p>
      ${a[2]}
    </p>

  `;


  d.onclick =
    () => fn(d, a);


  container.appendChild(d);


  return d;

}


/* =====================================================
   MULTIPLE
===================================================== */

function multi(
  id,
  arr,
  key,
  count,
  button,
  counter,
  onChange = null,
  lockSelected = false
) {

  const c =
    document.getElementById(id);


  c.innerHTML = "";


  arr.forEach(a => {

    mk(

      c,

      a,

      (d, x) => {

        const idx =
          S[key].indexOf(x[0]);


        if (idx >= 0) {

          if (lockSelected) {
            return;
          }

          S[key].splice(idx, 1);

          d.classList.remove(
            "selected"
          );

        }

        else {

          if (
            S[key].length >= count
          ) {

            return flashLimit(count);

          }


          S[key].push(x[0]);

          d.classList.add(
            "selected"
          );

          if (lockSelected) {
            d.classList.add("locked");
            d.setAttribute("aria-disabled", "true");
          }

        }


        document
          .getElementById(counter)
          .textContent =
            `${S[key].length} / ${count}`;


        document
          .getElementById(button)
          .disabled =
            S[key].length !== count;


        if (onChange) {

          onChange();

        }

      },

      S[key].includes(a[0])

    );

  });

}


/* =====================================================
   SINGLE
===================================================== */

function single(
  id,
  arr,
  key,
  button,
  onChange = null,
  lockSelected = false
) {

  const c =
    document.getElementById(id);


  c.innerHTML = "";


  arr.forEach(a => {

    mk(

      c,

      a,

      (d, x) => {

        S[key] =
          x[0];


        [
          ...c.children
        ].forEach(el =>
          el.classList.remove(
            "selected"
          )
        );


        d.classList.add(
          "selected"
        );


        if (button) {

          document
            .getElementById(button)
            .disabled = false;

        }


        if (onChange) {

          onChange();

        }

      },

      S[key] === a[0]

    );

  });

}


/* =====================================================
   LÍMITE DE SELECCIÓN
===================================================== */

function flashLimit(n) {

  alert(
    `Ya seleccionaron ${n} opciones. Para elegir otra, primero desmarquen una.`
  );

}


/* =====================================================
   FASE 01
   RENDER DEL ORDEN
===================================================== */

function renderAnalysis() {

  const c =
    document.getElementById("timeline");


  c.innerHTML = "";


  timeline.forEach(
    (item, index) => {

      const d =
        document.createElement("article");


      d.className =
        "sortableItem";


      d.draggable = true;


      d.dataset.id =
        item[0];


      d.innerHTML = `

        <div class="orderNumber">
          ${index + 1}
        </div>

        <div class="dragIcon">
          ☷
        </div>

        <div class="sortableText">

          <b>
            ${item[1]}
          </b>

          <p>
            ${item[2]}
          </p>

        </div>

        <div class="orderButtons">

          <button
            type="button"
            title="Subir"
            onclick="moveAnalysis(${index}, -1)"
            ${index === 0 ? "disabled" : ""}
          >
            ↑
          </button>

          <button
            type="button"
            title="Bajar"
            onclick="moveAnalysis(${index}, 1)"
            ${index === timeline.length - 1 ? "disabled" : ""}
          >
            ↓
          </button>

        </div>

      `;


      d.addEventListener(
        "dragstart",
        analysisDragStart
      );


      d.addEventListener(
        "dragover",
        analysisDragOver
      );


      d.addEventListener(
        "dragleave",
        analysisDragLeave
      );


      d.addEventListener(
        "drop",
        analysisDrop
      );


      d.addEventListener(
        "dragend",
        analysisDragEnd
      );


      c.appendChild(d);

    }
  );

}


/* =====================================================
   ARRASTRAR
===================================================== */

let draggedAnalysisId = null;


function analysisDragStart(e) {

  draggedAnalysisId =
    e.currentTarget.dataset.id;


  e.currentTarget.classList.add(
    "dragging"
  );


  e.dataTransfer.effectAllowed =
    "move";


  e.dataTransfer.setData(
    "text/plain",
    draggedAnalysisId
  );

}


function analysisDragOver(e) {

  e.preventDefault();


  e.currentTarget.classList.add(
    "dragOver"
  );


  e.dataTransfer.dropEffect =
    "move";

}


function analysisDragLeave(e) {

  e.currentTarget.classList.remove(
    "dragOver"
  );

}


function analysisDrop(e) {

  e.preventDefault();


  const target =
    e.currentTarget;


  target.classList.remove(
    "dragOver"
  );


  const targetId =
    target.dataset.id;


  if (
    !draggedAnalysisId ||
    draggedAnalysisId === targetId
  ) {

    return;

  }


  const from =
    timeline.findIndex(
      x => x[0] === draggedAnalysisId
    );


  const to =
    timeline.findIndex(
      x => x[0] === targetId
    );


  if (
    from < 0 ||
    to < 0
  ) {

    return;

  }


  const moved =
    timeline.splice(from, 1)[0];


  timeline.splice(
    to,
    0,
    moved
  );


  renderAnalysis();

}


function analysisDragEnd(e) {

  e.currentTarget.classList.remove(
    "dragging"
  );


  document
    .querySelectorAll(".sortableItem")
    .forEach(el =>
      el.classList.remove(
        "dragOver"
      )
    );


  draggedAnalysisId =
    null;

}


/* =====================================================
   BOTONES ↑ ↓
===================================================== */

function moveAnalysis(index, direction) {

  const newIndex =
    index + direction;


  if (
    newIndex < 0 ||
    newIndex >= timeline.length
  ) {

    return;

  }


  const temp =
    timeline[index];


  timeline[index] =
    timeline[newIndex];


  timeline[newIndex] =
    temp;


  renderAnalysis();

}


/* =====================================================
   PUNTAJE DE ANALIZAR
===================================================== */

function calculateAnalysisScore() {

  const correctOrder = [

    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8"

  ];


  const currentOrder =
    timeline.map(
      x => x[0]
    );


  let correct = 0;


  currentOrder.forEach(
    (id, index) => {

      if (
        id === correctOrder[index]
      ) {

        correct++;

      }

    }
  );


  /*
   * 10 puntos máximos.
   * Cada posición correcta vale 1,25.
   */

  S.analysisScore =
    Math.round(
      correct * 1.25 * 100
    ) / 100;


  S.analysisOrder =
    currentOrder;


  log(

    "ANALYSIS_RESULT",

    {

      correctPositions:
        correct,

      score:
        S.analysisScore,

      order:
        currentOrder

    }

  );

}


/* =====================================================
   RENDER GENERAL
===================================================== */

function render() {

  renderAnalysis();


  multi(
    "evidence",
    evidence,
    "evidence",
    6,
    "eb",
    "ec"
  );


  multi(
    "cross",
    cross,
    "cross",
    4,
    "cb",
    "cc"
  );


  multi(
    "contr",
    contr,
    "contr",
    3,
    "kb",
    "kc"
  );


  renderHypothesis();


  const sc =
    document.getElementById(
      "suspects"
    );


  sc.innerHTML = "";


  sus.forEach(a => {

    mk(

      sc,

      a,

      (d, x) => {

        if (
          S.questions.includes(
            x[0]
          )
        ) {

          return;

        }


        if (
          S.questions.length >= 3
        ) {

          return alert(
            "Ya utilizaron las 3 oportunidades."
          );

        }


        S.questions.push(
          x[0]
        );


        S.answers.push({

          id: x[0],

          question: x[2],

          answer: x[3]

        });


        d.classList.add(
          "selected"
        );


        document
          .getElementById("qc")
          .textContent =
            `${S.questions.length} / 3`;


        document
          .getElementById("answers")
          .innerHTML += `

            <div class="answer">

              <b>
                ${x[1]}
              </b>

              <span>
                ${x[2]}
              </span>

              <p>
                ${x[3]}
              </p>

            </div>

          `;


        document
          .getElementById("ib")
          .disabled =
            S.questions.length !== 3;

      },

      S.questions.includes(
        a[0]
      )

    );

  });


  single(
    "updates",
    updates,
    "update",
    "ub"
  );


  multi(
    "actions",
    actions,
    "actions",
    4,
    "ab",
    "ac",
    updateMetrics,
    true
  );


  single(
    "ethics",
    ethics,
    "ethics",
    "ethb"
  );


  single(
    "verdict",
    verdicts,
    "verdict",
    null,
    validate
  );


  document
    .getElementById("report")
    .oninput =
      validate;


  updateMetrics();


  validate();

}


/* =====================================================
   HIPÓTESIS
===================================================== */

function renderHypothesis() {

  single(
    "hyp",
    hyps,
    "hyp",
    null,
    renderHypEvidence
  );


  renderHypEvidence();

}


function renderHypEvidence() {

  const c =
    document.getElementById("he");


  c.innerHTML = "";


  S.hypEvidence =
    S.hypEvidence.filter(
      id =>
        S.evidence.includes(id)
    );


  if (!S.hyp) {

    document
      .getElementById("hb")
      .disabled = true;

    return;

  }


  const available =
    evidence.filter(
      e =>
        S.evidence.includes(
          e[0]
        )
    );


  if (!available.length) {

    c.innerHTML = `

      <div class="empty">

        Primero seleccionen evidencias
        en la Fase 02.

      </div>

    `;


    document
      .getElementById("hb")
      .disabled = true;


    return;

  }


  available.forEach(a => {

    mk(

      c,

      a,

      (d, x) => {

        const idx =
          S.hypEvidence.indexOf(
            x[0]
          );


        if (idx >= 0) {

          S.hypEvidence.splice(
            idx,
            1
          );


          d.classList.remove(
            "selected"
          );

        }

        else {

          if (
            S.hypEvidence.length >= 3
          ) {

            return flashLimit(3);

          }


          S.hypEvidence.push(
            x[0]
          );


          d.classList.add(
            "selected"
          );

        }


        document
          .getElementById("hb")
          .disabled =
            S.hypEvidence.length !== 3;

      },

      S.hypEvidence.includes(
        a[0]
      )

    );

  });


  document
    .getElementById("hb")
    .disabled =
      S.hypEvidence.length !== 3;

}


/* =====================================================
   MÉTRICAS
===================================================== */

function updateMetrics() {

  let r = 50;
  let k = 50;
  let p = 50;
  let t = 50;


  S.actions.forEach(a => {

    if (a === "A1") {

      p += 30;
      k -= 5;
      t += 10;

    }


    if (a === "A2") {

      r += 25;
      k += 35;
      t -= 30;

    }


    if (a === "A3") {

      r += 10;
      k -= 15;
      t += 15;

    }


    if (a === "A4") {

      r += 20;
      k -= 5;
      t += 25;

    }


    if (a === "A5") {

      p -= 35;
      k -= 10;
      t -= 20;

    }


    if (a === "A6") {

      k -= 20;
      t += 30;
      p += 15;

    }


    if (a === "A7") {

      r += 30;
      k += 25;
      t -= 20;

    }


    if (a === "A8") {

      k += 5;
      t -= 5;

    }

  });


  [
    ["reach", r],
    ["risk", k],
    ["proof", p],
    ["trust", t]

  ].forEach(
    ([id, v]) => {

      document
        .getElementById(id)
        .textContent =
          Math.max(
            0,
            Math.min(
              100,
              v
            )
          );

    }
  );

}


/* =====================================================
   VALIDAR INFORME
===================================================== */

function validate() {

  const report =
    document
      .getElementById("report")
      .value
      .trim();


  document
    .getElementById("reportCount")
    .textContent =
      report.length;


  document
    .getElementById("fb")
    .disabled =
      !(
        S.verdict &&
        report.length >= 80
      );

}


/* =====================================================
   FINALIZAR
===================================================== */

function finish() {

  S.report =
    document
      .getElementById("report")
      .value
      .trim();


  S.anomaly =
    document
      .getElementById("anomaly")
      .value
      .trim();


  clearInterval(timer);


  const payload = {

    ...S,

    submissionId:
      "SUB-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8),

    timestamp:
      new Date().toISOString(),

    durationSeconds:
      TOTAL - left

  };


  const button =
    document.getElementById("fb");


  button.disabled = true;

  button.textContent =
    "TRANSMITIENDO...";


  fetch(

    SCRIPT_URL,

    {

      method: "POST",

      mode: "no-cors",

      headers: {

        "Content-Type":
          "text/plain;charset=utf-8"

      },

      body:
        JSON.stringify(payload)

    }

  )

  .then(() => {

    go(11);

  })

  .catch(() => {

    button.disabled =
      false;

    button.textContent =
      "CERRAR CASO →";


    alert(
      "No se pudo transmitir. Avise al docente y conserve una captura."
    );

  });

}