/* Tabla — carrusel en construcción.
   A deterministic simulated run (~16 s): five stages, five slides.
   Slides fill over 0–80 %, checks land over 80–95 %, done at 100 %. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var SLIDES = 5;
  var BUILD_END = 80;
  var CHECK_END = 95;
  var TICK = 250; // ms between rendered frames; CSS eases between them
  // Stage lengths (ms). Writing takes longest, like the real thing.
  var DURATIONS = [3000, 2800, 4400, 2800, 3200];
  var TOTAL = DURATIONS.reduce(function (a, b) { return a + b; }, 0);

  var STATUS = [
    "Leyendo tu carta y las fotos del local",
    "Detectando los platos que más se piden",
    "Escribiendo el texto de cada slide",
    "Puliendo colores, márgenes y portada",
    "Revisando nombres y precios, slide por slide",
  ];
  var DONE_STATUS = "Carrusel listo: 5 slides revisadas, listas para publicar.";

  var root = document.querySelector(".loader");
  var scene = document.getElementById("scene");
  var slots = Array.prototype.slice.call(scene.querySelectorAll(".slot"));
  var steps = Array.prototype.slice.call(document.querySelectorAll("#steps li"));
  var pctEl = document.getElementById("pct");
  var bar = document.getElementById("bar");
  var barFill = document.getElementById("bar-fill");
  var statusEl = document.getElementById("status");
  var elapsedEl = document.getElementById("elapsed");
  var remainingEl = document.getElementById("remaining");
  var toggleBtn = document.getElementById("toggle");
  var restartBtn = document.getElementById("restart");

  var clamp01 = function (n) { return Math.max(0, Math.min(1, n)); };

  var t = 0; // simulated ms
  var timer = null;
  var userPaused = false;
  var visible = true;
  var lastStage = null;
  var lastPct = null;

  // ---- Model -------------------------------------------------------------

  function stageAt(ms) {
    var acc = 0;
    for (var s = 0; s < DURATIONS.length; s++) {
      if (ms < acc + DURATIONS[s]) return { stage: s, local: (ms - acc) / DURATIONS[s] };
      acc += DURATIONS[s];
    }
    return { stage: 5, local: 1 };
  }

  function pctAt(ms) {
    var p = stageAt(ms);
    if (p.stage >= 5) return 100;
    return Math.min(99, Math.floor(p.stage * 20 + p.local * 20));
  }

  // Pure: the deck at pct during stage (0–4, 5 = done).
  function deckFrame(pct, stage) {
    var checking = stage >= 4;
    var build = Math.min(clamp01(pct / BUILD_END), checking ? 1 : 0.97);
    var checks = stage >= 5 ? 1 : checking ? clamp01((pct - BUILD_END) / (CHECK_END - BUILD_END)) : 0;
    var slides = [];
    for (var i = 0; i < SLIDES; i++) {
      var f = clamp01(build * SLIDES - i);
      slides.push({
        arrived: i === 0 || build * SLIDES >= i,
        image: clamp01(f / 0.5),
        lines: [0, 1, 2].map(function (k) { return clamp01((f - 0.5 - k / 6) * 6); }),
        checked: checking && f >= 1 && checks >= (i + 1) / (SLIDES + 1),
      });
    }
    if (stage >= 5) return { slides: slides, active: -1 };
    var building = slides.findIndex(function (s) { return s.lines[2] < 1; });
    var unchecked = slides.findIndex(function (s) { return !s.checked; });
    var active = checking
      ? (unchecked === -1 ? SLIDES - 1 : unchecked)
      : (building === -1 ? SLIDES - 1 : building);
    return { slides: slides, active: active };
  }

  // ---- Render ------------------------------------------------------------

  function clock(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  function setAttr(el, name, on) {
    if (on) el.setAttribute(name, "");
    else el.removeAttribute(name);
  }

  function stepMeta(i, stage, frame) {
    if (i !== stage) return "";
    if (i === 0) return "32 platos · 6 fotos";
    if (i === 1) return "Cuy, chiri uchu, chicha";
    if (i === 2) return "Slide " + (frame.active + 1) + " de 5";
    if (i === 3) return "Portada y cierre";
    var n = frame.slides.filter(function (s) { return s.checked; }).length;
    return n + " de 5";
  }

  function render() {
    var p = stageAt(t);
    var stage = p.stage;
    var pct = pctAt(t);
    var done = stage >= 5;
    var frame = deckFrame(pct, stage);

    scene.setAttribute("data-stage", done ? "done" : String(stage));
    setAttr(root, "data-done", done);

    slots.forEach(function (slot, i) {
      var s = frame.slides[i];
      var isActive = i === frame.active && s.arrived;
      setAttr(slot, "data-arrived", s.arrived);
      setAttr(slot, "data-active", isActive);
      setAttr(slot, "data-checked", s.checked);
      slot.querySelector(".pic").style.setProperty("--img", s.image.toFixed(3));
      var typing = isActive && stage === 2 ? s.lines.findIndex(function (l) { return l < 1; }) : -1;
      slot.querySelectorAll(".ln").forEach(function (ln, k) {
        ln.style.setProperty("--l", s.lines[k].toFixed(3));
        setAttr(ln, "data-typing", k === typing);
      });
    });

    if (pct !== lastPct) {
      pctEl.textContent = pct;
      bar.setAttribute("aria-valuenow", String(pct));
      bar.setAttribute("aria-valuetext", pct + " %, " + (done ? "listo" : STATUS[stage].toLowerCase()));
      barFill.style.setProperty("--p", String(pct / 100));
      lastPct = pct;
    }
    elapsedEl.textContent = clock(Math.min(t, TOTAL));
    remainingEl.textContent = done ? "0:00" : "~" + clock(TOTAL - t);

    if (stage !== lastStage) {
      statusEl.textContent = done ? DONE_STATUS : STATUS[stage] + "…";
      lastStage = stage;
    }
    steps.forEach(function (li, i) {
      li.setAttribute("data-state", i < stage ? "done" : i === stage ? "active" : "pending");
      li.querySelector(".meta").textContent = stepMeta(i, stage, frame);
    });

    toggleBtn.disabled = done;
  }

  // ---- Clock -------------------------------------------------------------

  function running() { return !userPaused && visible && !document.hidden && t < TOTAL; }

  function sync() {
    var go = running();
    scene.classList.toggle("is-idle", !go);
    if (go && !timer) {
      timer = setInterval(function () {
        t = Math.min(TOTAL, t + TICK);
        render();
        if (t >= TOTAL) sync(); // done: stop, wait for Reiniciar
      }, TICK);
    } else if (!go && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function restart() {
    t = 0;
    lastStage = null;
    lastPct = null;
    userPaused = false;
    toggleBtn.textContent = "Pausar";
    render();
    sync();
  }

  toggleBtn.addEventListener("click", function () {
    userPaused = !userPaused;
    toggleBtn.textContent = userPaused ? "Reanudar" : "Pausar";
    if (userPaused) statusEl.textContent = "En pausa · " + STATUS[stageAt(t).stage];
    else { lastStage = null; render(); }
    sync();
  });
  restartBtn.addEventListener("click", restart);

  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      sync();
    }).observe(scene);
  }

  restart();
})();
