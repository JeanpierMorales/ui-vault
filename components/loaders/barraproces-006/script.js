/* Caja Norte · conectar con Vitrina — handshake loader demo.
 *
 * Phases (deterministic, ~16 s if nobody clicks):
 *   install  3.0 s  0 → 30 %   step 1 working, line dashed
 *   await    ≤6.0 s 30 %       step 2 "Te toca": Autorizar is a real button,
 *                              auto-continues after 6 s so the demo never stalls
 *   connect  3.2 s  30 → 75 %  the key crosses the line at constant speed
 *   sync     4.2 s  75 → 100 % line solid + lock; catalogue count climbs
 *   done              100 %    waits for Reiniciar
 *   error             (from await/connect via "Simular error") broken line,
 *                              waits for Reintentar or Reiniciar
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var card = document.getElementById("card");
  if (!card) return;

  var $ = function (id) {
    return document.getElementById(id);
  };
  var link = $("link");
  var stageEl = $("stage");
  var pctEl = $("pct");
  var bar = $("bar");
  var barFill = $("barFill");
  var detail = $("detail");
  var approveBtn = $("approveBtn");
  var approveBody = $("approveBody");
  var errorBody = $("errorBody");
  var retryBtn = $("retryBtn");
  var hint = $("hint");
  var errBtn = $("errBtn");
  var resetBtn = $("resetBtn");
  var steps = {
    install: card.querySelector('[data-step="install"]'),
    approve: card.querySelector('[data-step="approve"]'),
    sync: card.querySelector('[data-step="sync"]'),
  };

  var TOTAL = 126;
  var DUR = { install: 3000, await: 6000, connect: 3200, sync: 4200 };
  var TICK = 100;

  var phase = "install";
  var t = 0; // ms elapsed in the current phase
  var pct = 0;
  var onScreen = true;
  var timer = null;

  /* Per phase: link drawing, step statuses + words, readout. */
  var VIEW = {
    install: {
      link: "idle",
      steps: { install: ["current", "Instalando", true], approve: ["upcoming", "Después"], sync: ["upcoming", "Después"] },
      stage: "Instalando Vitrina en Caja Norte",
    },
    await: {
      link: "idle",
      steps: { install: ["done", "Listo"], approve: ["current", "Te toca"], sync: ["upcoming", "Después"] },
      stage: "Esperando tu autorización",
    },
    connect: {
      link: "binding",
      steps: { install: ["done", "Listo"], approve: ["current", "Conectando", true], sync: ["upcoming", "Después"] },
      stage: "Enviando la llave privada a Vitrina",
    },
    sync: {
      link: "linked",
      steps: { install: ["done", "Listo"], approve: ["done", "Listo"], sync: ["current", "Sincronizando", true] },
      stage: "Conectado. Copiando tu catálogo a Vitrina",
    },
    done: {
      link: "linked",
      steps: { install: ["done", "Listo"], approve: ["done", "Listo"], sync: ["done", "Listo"] },
      stage: "Conectado. Vitrina ya muestra tu stock",
    },
    error: {
      link: "broken",
      steps: { install: ["done", "Listo"], approve: ["failed", "No se conectó"], sync: ["upcoming", "Después"] },
      stage: "No se conectó: el código de Vitrina venció",
    },
  };

  function lerp(a, b, k) {
    return a + (b - a) * Math.min(1, Math.max(0, k));
  }

  function setPct(value) {
    pct = value;
    var shown = Math.round(value);
    pctEl.textContent = String(shown);
    bar.setAttribute("aria-valuenow", String(shown));
    barFill.style.transform = "scaleX(" + (value / 100).toFixed(4) + ")";
  }

  function setDisabled(btn, off) {
    if (off) btn.setAttribute("aria-disabled", "true");
    else btn.removeAttribute("aria-disabled");
  }

  /* Phase change: everything structural. */
  function render(arrive) {
    var v = VIEW[phase];
    card.setAttribute("data-phase", phase);
    link.setAttribute("data-link", v.link);
    link.classList.toggle("arrive", !!arrive);

    Object.keys(steps).forEach(function (key) {
      var li = steps[key];
      var s = v.steps[key];
      li.setAttribute("data-status", s[0]);
      if (s[2]) li.setAttribute("data-working", "");
      else li.removeAttribute("data-working");
      if (s[0] === "current") li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
      li.querySelector("[data-word]").textContent = s[1];
    });

    var failed = phase === "error";
    approveBody.hidden = failed;
    errorBody.hidden = !failed;

    var busy = phase === "connect";
    approveBtn.textContent = busy ? "Conectando…" : "Autorizar conexión";
    setDisabled(approveBtn, phase !== "await");
    if (busy) approveBtn.setAttribute("aria-busy", "true");
    else approveBtn.removeAttribute("aria-busy");
    hint.hidden = phase !== "await";

    setDisabled(errBtn, !(phase === "await" || phase === "connect"));
    stageEl.textContent = v.stage;
    update();
  }

  /* Every tick: numbers only. */
  function update() {
    switch (phase) {
      case "install":
        setPct(lerp(0, 30, t / DUR.install));
        detail.textContent = "Paso 1 de 3";
        break;
      case "await":
        setPct(30);
        detail.textContent = "Paso 2 de 3 · falta tu clic";
        hint.textContent = "Demo: se autoriza sola en " + Math.max(1, Math.ceil((DUR.await - t) / 1000)) + " s";
        break;
      case "connect":
        setPct(lerp(30, 75, t / DUR.connect));
        detail.textContent = "Paso 2 de 3 · la llave solo sirve para esta tienda";
        break;
      case "sync":
        setPct(lerp(75, 100, t / DUR.sync));
        detail.textContent =
          Math.round(lerp(0, TOTAL, t / DUR.sync)) + " de " + TOTAL + " productos";
        break;
      case "done":
        setPct(100);
        detail.textContent = TOTAL + " de " + TOTAL + " productos · 7:42 a. m.";
        break;
      case "error":
        detail.textContent = "Reintenta y se genera un código nuevo";
        break;
    }
  }

  function go(next, arrive) {
    phase = next;
    t = 0;
    render(arrive);
    if (next === "done" || next === "error") stop();
  }

  function tick() {
    if (document.hidden || !onScreen) return;
    t += TICK;
    if (phase === "install" && t >= DUR.install) go("await");
    else if (phase === "await" && t >= DUR.await) go("connect");
    else if (phase === "connect" && t >= DUR.connect) go("sync", true);
    else if (phase === "sync" && t >= DUR.sync) go("done");
    else update();
  }

  function start() {
    stop();
    timer = setInterval(tick, TICK);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function syncPaused() {
    card.classList.toggle("is-paused", document.hidden || !onScreen);
  }

  /* ---------------------------------------------------------- controls */

  approveBtn.addEventListener("click", function () {
    if (phase !== "await") return;
    go("connect");
  });

  errBtn.addEventListener("click", function () {
    if (!(phase === "await" || phase === "connect")) return;
    go("error");
    retryBtn.focus();
  });

  retryBtn.addEventListener("click", function () {
    go("await");
    start();
    approveBtn.focus();
  });

  resetBtn.addEventListener("click", function () {
    go("install");
    start();
  });

  document.addEventListener("visibilitychange", syncPaused);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      syncPaused();
    }).observe(card);
  }

  go("install");
  start();
})();
