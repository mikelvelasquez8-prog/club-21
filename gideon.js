let intervaloWave;

function iniciarOndas() {
    detenerOndas();
    intervaloWave = setInterval(() => {
        for (let i = 1; i <= 5; i++) {
            const barra = document.getElementById("b" + i);
            if (barra) barra.style.height = (Math.floor(Math.random() * 36) + 8) + "px";
        }
    }, 120);
}

function detenerOndas() {
    clearInterval(intervaloWave);
    for (let i = 1; i <= 5; i++) {
        const barra = document.getElementById("b" + i);
        if (barra) barra.style.height = "10px";
    }
}

function emitirVoz(texto) {
    const statusEl = document.getElementById("gideon-txt");
    const subEl = document.getElementById("gideon-sub");
    if (subEl) subEl.innerText = '"' + texto + '"';

    if (!('speechSynthesis' in window)) {
        if (statusEl) statusEl.innerText = "● NAVEGADOR SIN SÍNTESIS DE VOZ";
        return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const mensaje = new SpeechSynthesisUtterance(texto);
    const voces = window.speechSynthesis.getVoices();
    const vozEspanol = voces.find(v => v.lang.includes('es-AR') || v.lang.includes('es-ES') || v.lang.includes('es'));
    if (vozEspanol) mensaje.voice = vozEspanol;

    mensaje.lang = 'es-AR';
    mensaje.rate = 1.02;
    mensaje.pitch = 0.95;

    mensaje.onstart = function() {
        if (statusEl) {
            statusEl.innerText = "● GIDEON HABLANDO // TRANSMITIENDO AUDIO";
            statusEl.style.color = "#f5c6bc";
        }
        iniciarOndas();
    };

    mensaje.onend = function() {
        detenerOndas();
        if (statusEl) {
            statusEl.innerText = "● AGENTE ONLINE // CONEXIÓN ESTABLE POR VOZ";
            statusEl.style.color = "#a3d9c9";
        }
    };

    mensaje.onerror = function() {
        detenerOndas();
        if (statusEl) statusEl.innerText = "● AUDIO BLOQUEADO // REVISA PERMISOS DE SONIDO";
    };

    window.speechSynthesis.speak(mensaje);
}

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

window.hablarGideon = function() {
    emitirVoz("Inicializando interfaz de audio de Club 21. Hola, soy Gideon, el agente de inteligencia artificial con memoria continua. Mi infraestructura está operativa. Presiona Hablar con Gideon para hacerme una consulta.");
};

window.escucharUsuario = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const statusEl = document.getElementById("gideon-txt");
    const subEl = document.getElementById("gideon-sub");

    if (!SpeechRecognition) {
        emitirVoz("Tu navegador no soporta captura de micrófono web. Usa Edge o Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-AR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        if (statusEl) {
            statusEl.innerText = "● ESCUCHANDO OPERADOR // HABLA AHORA...";
            statusEl.style.color = "#bfe3f2";
        }
        if (subEl) subEl.innerText = "Micrófono activo. Te escucho...";
        iniciarOndas();
    };

    recognition.onresult = function(event) {
        detenerOndas();
        const transcripcion = event.results[0][0].transcript;
        const comando = transcripcion.toLowerCase();
        if (subEl) subEl.innerText = "Dijiste: " + transcripcion;

        if (comando.includes("servicio") || comando.includes("hacen") || comando.includes("club 21")) {
            emitirVoz("En Club 21 diseñamos agentes de inteligencia artificial con memoria persistente y células de desarrollo a medida.");
        } else if (comando.includes("precio") || comando.includes("cotizar") || comando.includes("presupuesto")) {
            emitirVoz("Completa el formulario comercial al pie de esta página y prepararemos una arquitectura a medida.");
        } else if (comando.includes("sir charrón") || comando.includes("charron")) {
            emitirVoz("Sir Charrón es nuestra línea de identidad y productos digitales independientes desarrollada bajo Club 21.");
        } else {
            emitirVoz("Recibido: " + transcripcion + ". Completa el formulario comercial aquí abajo para iniciar tu proyecto.");
        }
    };

    recognition.onerror = function(event) {
        detenerOndas();
        if (statusEl) {
            statusEl.innerText = "● ERROR DE MICRÓFONO (" + event.error + ")";
            statusEl.style.color = "#f5c6bc";
        }
    };

    recognition.start();
};
