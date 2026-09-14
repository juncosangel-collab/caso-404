const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyp5Ew24ThPgnVmrP9gy5tRgHTPsDen4SptbTzR_KSqqUT--r0JkktunHFJHn3mfHtlmQ/exec";
const TOTAL = 1080;

let left = TOTAL;
let timer;
let current = 0;
let locked = null;

const S = {
    group: '',
    members: '',
    startAt: null,
    timeline: 'T1-T8',
    evidence: [],
    cross: [],
    contr: [],
    hyp: null,
    hypEvidence: [],
    anomaly: '',
    questions: [],
    answers: [],
    update: null,
    actions: [],
    ethics: null,
    verdict: null,
    report: '',
    events: []
};


// =========================================================
// LÍNEA TEMPORAL
// =========================================================

const timeline = [
    ['08:07:14', 'ACCESO',
        'Cuenta inicia sesión desde dispositivo conocido.'],

    ['08:11:42', 'ARCHIVO',
        'Se crea copia local del material.'],

    ['08:16:03', 'MODIFICACIÓN',
        'Una copia registra modificación de metadatos.'],

    ['08:17:12', 'PRIMER REENVÍO',
        'Primer registro de circulación.'],

    ['08:24:51', 'CAPTURA',
        'Se genera captura recortada.'],

    ['08:31:08', 'SEGUNDA CADENA',
        'Aparece en otro grupo.'],

    ['08:47:33', 'ELIMINACIÓN',
        'La publicación original desaparece.'],

    ['09:05:19', 'ACUSACIÓN',
        'Comienzan acusaciones sin prueba concluyente.']
];


// =========================================================
// EVIDENCIAS
// =========================================================

const evidence = [

    ['E-01', 'Registro de acceso',
        'Cuenta conocida; no prueba quién tenía el dispositivo.'],

    ['E-02', 'Captura recortada',
        'Sin contexto anterior ni posterior.'],

    ['E-03', 'Log de publicación',
        'Publicación registrada 08:17:12.'],

    ['E-04', 'Metadatos IMG-4491',
        'Modificada 08:16:03.'],

    ['E-05', 'Mensaje reenviado',
        'Afirma recepción previa sin origen.'],

    ['E-06', 'Testimonio espectador',
        'Vio circulación, no primer envío.'],

    ['E-07', 'Registro de eliminación',
        'Original eliminado 08:47:33.'],

    ['E-08', 'Comentario anónimo',
        'Acusa sin aportar prueba.'],

    ['E-09', 'Horarios de actividad',
        'Actividad de varias cuentas 08:10–08:30.'],

    ['E-10', 'Encuesta informal',
        'Mayoría cree que fue una persona.'],

    ['E-11', 'Captura completa',
        'Conserva contexto y fecha.'],

    ['E-12', 'Audio transcripto',
        '“Ya lo tenía otra gente cuando me llegó”.'],

    ['E-13', 'Archivo secundario',
        'Copia sin metadatos verificables.'],

    ['E-14', 'Registro de recepción',
        'Recepción 08:11:58.'],

    ['E-15', 'Mensaje posterior',
        'Dice que recibió “recién” a las 08:19.'],

    ['E-16', 'Cadena de reenvíos',
        'Tres saltos posteriores.'],

    ['E-17', 'Captura supuestamente original',
        'Creación 08:11; modificación 08:26.'],

    ['E-18', 'Registro institucional',
        'Confirma datos personales.'],

    ['E-19', 'Hash de archivo',
        'No coincide con captura difundida.'],

    ['E-20', 'Rumor verbal',
        '“Todos saben quién fue”.'],

    ['E-21', 'Historial de edición',
        'Versión exportada tras primera circulación.'],

    ['E-22', 'Captura de perfil',
        'Relaciona cuenta con grupo, no con publicación.'],

    ['E-23', 'Eliminación local',
        'Copia eliminada 08:49.'],

    ['E-24', 'Mensaje de advertencia',
        'Pide detener reenvíos antes del final de cadena.']
];


// =========================================================
// CRUCES DE EVIDENCIA
// =========================================================

const cross = [

    ['C1', 'E-03 ↔ E-04',
        'Publicación y modificación deben cruzarse.'],

    ['C2', 'E-14 ↔ E-03',
        'Recepción previa a publicación visible.'],

    ['C3', 'E-16 ↔ E-07',
        'Cadena y eliminación deben compararse.'],

    ['C4', 'E-11 ↔ E-02',
        'Completa contextualiza recortada.'],

    ['C5', 'E-18 ↔ E-08',
        'Dato personal no vuelve prueba a una acusación.'],

    ['C6', 'E-19 ↔ E-17',
        'Hash y metadatos pueden revelar versiones distintas.'],

    ['C7', 'E-09 ↔ E-22',
        'Actividad/pertenencia no demuestra autoría.'],

    ['C8', 'E-20 ↔ E-10',
        'Dos rumores no son evidencia sólida.']
];


// =========================================================
// CONTRADICCIONES
// =========================================================

const contr = [

    ['K1', 'E-03 vs E-14',
        'Recepción antes de publicación registrada.'],

    ['K2', 'E-17 vs E-04',
        'Tiempos incompatibles.'],

    ['K3', 'E-15 vs E-12',
        'Recepción “recién” frente a circulación previa.'],

    ['K4', 'E-22 vs E-03',
        'Perfil asociado no demuestra publicación.'],

    ['K5', 'E-20 vs E-11',
        'Rumor identifica; captura completa no.'],

    ['K6', 'E-19 vs E-13',
        'Hashes no permiten tratarlos como idénticos.']
];


// =========================================================
// HIPÓTESIS
// =========================================================

const hyps = [

    ['H-A', 'AUTORÍA INDIVIDUAL',
        'Una persona explica casi toda la cadena.'],

    ['H-B', 'ACCESO EXTERNO',
        'Material obtenido/manipulado desde fuera.'],

    ['H-C', 'CADENA DE DIFUSIÓN',
        'Varias decisiones sucesivas producen el incidente.'],

    ['H-D', 'EVIDENCIA INSUFICIENTE',
        'No puede construirse explicación responsable.']
];


// =========================================================
// SOSPECHOSOS / INTERROGATORIO
// =========================================================

const sus = [

    ['S1', 'OPERADOR A',
        '¿Qué dispositivo utilizaste?',
        'El registro coincide con un dispositivo conocido, pero no prueba quién lo manipulaba.'],

    ['S2', 'OPERADOR B',
        '¿Cuándo recibiste el archivo?',
        'Dice 08:12; el registro asociado muestra 08:11:58.'],

    ['S3', 'TESTIGO C',
        '¿Viste el primer envío?',
        'No. Lo vi cuando ya había sido reenviado.'],

    ['S4', 'ADMINISTRADOR D',
        '¿Por qué se eliminó?',
        'Tras una advertencia sobre exposición de datos personales.'],

    ['S5', 'REMITENTE E',
        '¿Quién entregó la copia?',
        'No puede identificarse públicamente sin corroboración.']
];


// =========================================================
// ACTUALIZACIONES
// =========================================================

const updates = [

    ['U-A', 'TRATAR COMO PRUEBA DEFINITIVA',
        'La nueva información parece confirmar una acusación previa.'],

    ['U-B', 'ABRIR NUEVA LÍNEA',
        'La actualización revela una inconsistencia que obliga a revisar.'],

    ['U-C', 'IGNORAR',
        'Llegó tarde y no debería afectar el caso.'],

    ['U-D', 'PUBLICAR',
        'La comunidad debe conocer inmediatamente el nuevo dato.']
];


// =========================================================
// ACCIONES
// =========================================================

const actions = [

    ['A1', 'PRESERVAR EVIDENCIAS',
        'Originales, cadena de custodia y acceso limitado.'],

    ['A2', 'PUBLICAR NOMBRES',
        'Identificar públicamente a señalados.'],

    ['A3', 'RESTRINGIR DIFUSIÓN',
        'Detener reenvíos sensibles y conservar acceso institucional.'],

    ['A4', 'CAMPAÑA EDUCATIVA',
        'Verificación, contexto y reenvíos responsables.'],

    ['A5', 'BORRAR TODO',
        'Eliminar pruebas para reducir circulación.'],

    ['A6', 'DERIVAR INSTITUCIONALMENTE',
        'Entregar información necesaria a responsables.'],

    ['A7', 'COMPARTIR CAPTURA COMPLETA',
        'Difundir evidencia completa.'],

    ['A8', 'ACUSACIÓN PRIVADA',
        'Acusar directamente sin corroboración.']
];


// =========================================================
// DILEMA ÉTICO
// =========================================================

const ethics = [

    ['ET-A', 'PUBLICAR TODO',
        'Transparencia por encima de privacidad.'],

    ['ET-B', 'OCULTAR NOMBRES Y PUBLICAR',
        'No identifica, pero mantiene material sensible circulando.'],

    ['ET-C', 'MINIMIZAR DATOS Y DERIVAR',
        'Solo información necesaria, acceso restringido y canal institucional.'],

    ['ET-D', 'ELIMINAR PRUEBAS',
        'Eliminar toda evidencia disponible.']
];


// =========================================================
// VEREDICTOS
// =========================================================

const verdicts = [

    ['V-A', 'CULPABLE ÚNICO',
        'Permite señalar públicamente a una persona.'],

    ['V-B', 'CADENA RESPONSABLE',
        'Cadena de decisiones sin convertir sospecha en condena.'],

    ['V-C', 'SIN INTERVENCIÓN',
        'La incertidumbre impide actuar.'],

    ['V-D', 'BORRAR Y CERRAR',
        'Eliminar material y terminar investigación.'],

    ['V-E', 'DERIVACIÓN CON PROTECCIÓN',
        'Intervenir institucionalmente preservando datos.']
];


// =========================================================
// REGISTRO DE EVENTOS
// =========================================================

function log(type, data = {}) {

    S.events.push({
        time: new Date().toISOString(),
        phase: current,
        type: type,
        data: data
    });

}


// =========================================================
// INICIO DEL JUEGO
// =========================================================

function startGame() {

    S.group = document.getElementById('group').value.trim();
    S.members = document.getElementById('members').value.trim();

    if (!S.group || !S.members) {
        return alert('Completen grupo e integrantes.');
    }

    S.startAt = new Date().toISOString();

    log('START');

    render();

    timer = setInterval(() => {

        left--;

        document.getElementById('timer').textContent =
            `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;

        if (left <= 0) {

            clearInterval(timer);

            alert(
                'TIEMPO AGOTADO. Continúen y cierren el protocolo.'
            );
        }

    }, 1000);

    go(1);
}


// =========================================================
// CAMBIO DE FASE
// =========================================================

function go(n) {

    current = n;

    document.querySelectorAll('.screen')
        .forEach(x => x.classList.remove('active'));

    document
        .getElementById(
            n === 0 ? 'start' :
            n === 11 ? 'finish' :
            'p' + n
        )
        .classList.add('active');

    document.getElementById('progress').style.width =
        Math.min(100, (n - 1) * 10) + '%';

    log('PHASE_OPEN', { n: n });
}


// =========================================================
// SELLAR DECISIÓN
// =========================================================

function seal(n) {

    log('DECISION', {
        phase: n
    });

    lock(
        () => go(n + 1),
        'Esta fase quedó sellada. No existe deshacer.'
    );
}


// =========================================================
// BLOQUEO
// =========================================================

function lock(cb, msg) {

    locked = cb;

    document.getElementById('lockmsg').textContent = msg;

    document.getElementById('overlay')
        .classList.add('active');
}


function continueLock() {

    document.getElementById('overlay')
        .classList.remove('active');

    let x = locked;

    locked = null;

    if (x) {
        x();
    }
}


// =========================================================
// CREAR OPCIONES
// =========================================================

function mk(container, a, fn) {

    let d = document.createElement('article');

    d.className = 'choice';

    d.innerHTML = `
        <h3>${a[0]} // ${a[1]}</h3>
        <p>${a[2]}</p>
    `;

    d.onclick = () => fn(d, a);

    container.appendChild(d);

    return d;
}


// =========================================================
// SELECCIÓN MÚLTIPLE
// =========================================================

function multi(id, arr, key, count, button, counter) {

    const c = document.getElementById(id);

    arr.forEach(a => {

        mk(c, a, (d, x) => {

            if (S[key].includes(x[0])) {

                S[key] =
                    S[key].filter(v => v !== x[0]);

                d.classList.remove('selected');

            } else {

                if (S[key].length >= count) {
                    return alert('Límite alcanzado.');
                }

                S[key].push(x[0]);

                d.classList.add('selected');
            }

            document.getElementById(counter).textContent =
                `${S[key].length} / ${count}`;

            document.getElementById(button).disabled =
                S[key].length !== count;
        });

    });
}


// =========================================================
// RENDERIZAR JUEGO
// =========================================================

function render() {

    // Línea temporal
    let timelineContainer =
        document.getElementById('timeline');

    timeline.forEach(x => {

        let d = document.createElement('article');

        d.className = 'card';

        d.innerHTML = `
            <h3>${x[0]} // ${x[1]}</h3>
            <p>${x[2]}</p>
        `;

        timelineContainer.appendChild(d);

    });


    // Evidencias
    multi(
        'evidence',
        evidence,
        'evidence',
        6,
        'eb',
        'ec'
    );


    // Cruces
    multi(
        'cross',
        cross,
        'cross',
        4,
        'cb',
        'cc'
    );


    // Contradicciones
    multi(
        'contr',
        contr,
        'contr',
        3,
        'kb',
        'kc'
    );


    // Hipótesis
    hyps.forEach(a => {

        mk(
            document.getElementById('hyp'),
            a,
            (d, x) => {

                if (S.hyp) {
                    return;
                }

                S.hyp = x[0];

                d.classList.add('selected');

                let c =
                    document.getElementById('he');

                evidence.forEach(e => {

                    if (S.evidence.includes(e[0])) {

                        mk(
                            c,
                            [e[0], e[1], e[2]],
                            (q, z) => {

                                if (
                                    S.hypEvidence
                                        .includes(z[0])
                                ) {

                                    S.hypEvidence =
                                        S.hypEvidence.filter(
                                            v => v !== z[0]
                                        );

                                    q.classList.remove(
                                        'selected'
                                    );

                                } else {

                                    if (
                                        S.hypEvidence.length >= 3
                                    ) {
                                        return alert(
                                            'Límite: 3.'
                                        );
                                    }

                                    S.hypEvidence.push(z[0]);

                                    q.classList.add(
                                        'selected'
                                    );
                                }

                                document.getElementById(
                                    'hb'
                                ).disabled =
                                    S.hypEvidence.length !== 3;
                            }
                        );

                    }

                });

            }
        );

    });


    // Interrogatorio
    sus.forEach(a => {

        mk(
            document.getElementById('suspects'),
            a,
            (d, x) => {

                if (
                    S.questions.length >= 3 ||
                    S.questions.includes(x[0])
                ) {
                    return alert(
                        'No hay más oportunidades.'
                    );
                }

                S.questions.push(x[0]);

                S.answers.push({
                    id: x[0],
                    question: x[2],
                    answer: x[3]
                });

                d.classList.add('selected');

                document.getElementById('qc').textContent =
                    `${S.questions.length} / 3`;

                document.getElementById(
                    'answers'
                ).innerHTML += `
                    <p>
                        <b>${x[1]}</b><br>
                        ${x[2]}<br>
                        <span style="color:#65ff9a">
                            RESPUESTA:
                        </span>
                        ${x[3]}
                    </p>
                `;

                document.getElementById('ib').disabled =
                    S.questions.length !== 3;
            }
        );

    });


    // Actualización
    updates.forEach(a => {

        mk(
            document.getElementById('updates'),
            a,
            (d, x) => {

                if (S.update) {
                    return;
                }

                S.update = x[0];

                d.classList.add('selected');

                document.getElementById('ub').disabled =
                    false;
            }
        );

    });


    // Acciones
    multi(
        'actions',
        actions,
        'actions',
        4,
        'ab',
        'ac'
    );


    // Dilema ético
    ethics.forEach(a => {

        mk(
            document.getElementById('ethics'),
            a,
            (d, x) => {

                if (S.ethics) {
                    return;
                }

                S.ethics = x[0];

                d.classList.add('selected');

                document.getElementById('ethb').disabled =
                    false;
            }
        );

    });


    // Veredicto
    verdicts.forEach(a => {

        mk(
            document.getElementById('verdict'),
            a,
            (d, x) => {

                if (S.verdict) {
                    return;
                }

                S.verdict = x[0];

                d.classList.add('selected');

                validate();
            }
        );

    });


    // Informe final
    document.getElementById('report').oninput =
        validate;
}


// =========================================================
// VALIDAR INFORME FINAL
// MÍNIMO: 80 CARACTERES
// =========================================================

function validate() {

    const caracteres =
        document.getElementById('report')
            .value
            .trim()
            .length;

    document.getElementById('fb').disabled =
        !(S.verdict && caracteres >= 80);
}


// =========================================================
// MÉTRICAS DE INTERVENCIÓN
// =========================================================

function updateMetrics() {

    let r = 50;
    let k = 50;
    let p = 50;
    let t = 50;

    S.actions.forEach(a => {

        if (a === 'A1') {
            p += 30;
            k -= 5;
            t += 10;
        }

        if (a === 'A2') {
            r += 25;
            k += 35;
            t -= 30;
        }

        if (a === 'A3') {
            r += 10;
            k -= 15;
            t += 15;
        }

        if (a === 'A4') {
            r += 20;
            k -= 5;
            t += 25;
        }

        if (a === 'A5') {
            p -= 35;
            k -= 10;
            t -= 20;
        }

        if (a === 'A6') {
            k -= 20;
            t += 30;
            p += 15;
        }

        if (a === 'A7') {
            r += 30;
            k += 25;
            t -= 20;
        }

        if (a === 'A8') {
            k += 5;
            t -= 5;
        }

    });

    [
        ['reach', r],
        ['risk', k],
        ['proof', p],
        ['trust', t]

    ].forEach(x => {

        document.getElementById(x[0])
            .textContent =
            Math.max(
                0,
                Math.min(100, x[1])
            );

    });
}


// =========================================================
// ACTUALIZAR MÉTRICAS AL ELEGIR ACCIONES
// =========================================================

const oldMulti = multi;

multi = function(
    id,
    arr,
    key,
    count,
    button,
    counter
) {

    oldMulti(
        id,
        arr,
        key,
        count,
        button,
        counter
    );

    if (key === 'actions') {

        const c =
            document.getElementById(id);

        c.addEventListener(
            'click',
            () => updateMetrics()
        );
    }
};


// =========================================================
// FINALIZAR Y ENVIAR RESULTADO
// =========================================================

function finish() {

    S.report =
        document.getElementById('report')
            .value
            .trim();

    clearInterval(timer);

    const payload = {

        ...S,

        submissionId:
            'SUB-' +
            Date.now() +
            '-' +
            Math.random()
                .toString(36)
                .slice(2, 8),

        timestamp:
            new Date().toISOString(),

        durationSeconds:
            TOTAL - left
    };


    fetch(
        SCRIPT_URL,
        {
            method: 'POST',

            mode: 'no-cors',

            headers: {
                'Content-Type':
                    'text/plain;charset=utf-8'
            },

            body:
                JSON.stringify(payload)
        }
    )

    .then(() => {
        go(11);
    })

    .catch(() => {

        alert(
            'No se pudo transmitir. ' +
            'Avise al docente y conserve una captura.'
        );

    });
}