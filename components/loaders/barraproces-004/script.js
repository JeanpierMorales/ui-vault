/* Margen — lectura por etapas (barraproces-004)
 *
 * Demo determinista de ~17.6 s: Recibido → Extrayendo → Ordenando → listo.
 * Un reloj propio (requestAnimationFrame) avanza solo mientras la demo corre:
 * se detiene con «Pausar», fuera de pantalla y con la pestaña oculta.
 * Cada evento de la línea de tiempo deja su estado final en el estilo en línea
 * y, si hay movimiento permitido, anima desde el estado anterior
 * (Web Animations, solo transform / opacity / background-size).
 * Con prefers-reduced-motion los eventos ocurren igual, pero sin movimiento.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var root = document.getElementById('lec');
  if (!root) return;

  var desk = document.getElementById('desk');
  var sheet = document.getElementById('sheet');
  var text = document.getElementById('sheetText');
  var scan = document.getElementById('scan');
  var rail = document.getElementById('rail');
  var paras = [].slice.call(sheet.querySelectorAll('.para'));
  var slots = [].slice.call(rail.querySelectorAll('.slot'));
  var cards = [].slice.call(rail.querySelectorAll('.card'));
  var stepEls = [].slice.call(document.querySelectorAll('.step'));
  var label = document.getElementById('stageLabel');
  var pctEl = document.getElementById('pct');
  var bar = document.getElementById('bar');
  var barFill = document.getElementById('barFill');
  var status = document.getElementById('status');
  var pauseBtn = document.getElementById('pauseBtn');
  var restartBtn = document.getElementById('restartBtn');

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(mq && mq.matches);
  if (mq) {
    var onMq = function () { reduce = mq.matches; };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  var EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
  var EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

  /* Línea de tiempo, en segundos */
  var T_EXTRACT = 2.4;
  var SWEEP_EVERY = 2.8; // un barrido por hallazgo
  var SWEEP_DELAY = 0.3;
  var SWEEP = 1.6; // de arriba a abajo de la hoja
  var T_RANK = T_EXTRACT + 4 * SWEEP_EVERY; // 13.6
  var T_DONE = T_RANK + 4; // 17.6
  var CARD_IN = 0.45;

  var FINDS = 4;
  var SCORES = cards.map(function (c) { return parseFloat(c.style.getPropertyValue('--score')) || 0; });
  /* Orden final, de más a menos peso: índice de tarjeta → puesto */
  var RANKED = (function () {
    var order = cards.map(function (_, i) { return i; }).sort(function (a, b) { return SCORES[b] - SCORES[a]; });
    var place = [];
    order.forEach(function (k, pos) { place[k] = pos; });
    return place;
  })();

  var STAGES = {
    received: {
      label: 'Recibido',
      status: 'Manuscrito recibido. Preparando la lectura del capítulo 3.'
    },
    extracting: {
      label: 'Extrayendo · 0 de 4 hallazgos',
      status: 'Leyendo página por página: personajes, escenas y lugares.'
    },
    ranking: {
      label: 'Ordenando por peso en la historia',
      status: 'Puntuando los 4 hallazgos y ordenándolos de más a menos peso.'
    },
    done: {
      label: 'Informe listo',
      status: 'Listo. 4 hallazgos ordenados por peso en la historia.'
    }
  };
  var STEP_ORDER = ['received', 'extracting', 'ranking'];

  var t = 0;
  var stage = 'done';
  var queue = [];
  var anims = [];
  var loops = [];
  var userPaused = false;
  var offscreen = false;
  var raf = 0;
  var last = 0;
  var lastPct = -1;
  var landed = []; // tarjetas en el riel, la más nueva primero
  var waveFound = 0;

  /* ---------- utilidades ---------- */

  function animate(el, frames, ms, easing) {
    if (reduce || typeof el.animate !== 'function') return null;
    var a = el.animate(frames, { duration: ms, easing: easing || 'linear' });
    anims.push(a);
    a.onfinish = function () {
      var i = anims.indexOf(a);
      if (i > -1) anims.splice(i, 1);
    };
    if (!isRunning()) a.pause();
    return a;
  }

  function cancelAll() {
    anims.concat(loops).forEach(function (a) { a.cancel(); });
    anims = [];
    loops = [];
  }

  function slotPx(n) {
    var h = cards[0].offsetHeight;
    var gap = parseFloat(getComputedStyle(root).getPropertyValue('--gap')) || 6;
    return n * (h + gap);
  }

  function setN(card, n) { card.style.setProperty('--n', n); }

  /* Cortar la hoja en una cantidad entera de líneas */
  function fitLines() {
    text.style.maxHeight = '';
    var line = parseFloat(getComputedStyle(paras[0]).lineHeight);
    if (line) text.style.maxHeight = Math.floor(text.clientHeight / line) * line + 'px';
  }

  /* Posición de un elemento en el barrido (0 arriba, 1 abajo), en coordenadas de la hoja */
  function geometry() {
    var from = text.offsetTop - 6;
    var to = text.offsetTop + text.clientHeight + 4;
    return {
      from: from,
      span: to - from,
      at: function (el, share) {
        var top = 0;
        for (var node = el; node && node !== text; node = node.offsetParent) top += node.offsetTop;
        var y = text.offsetTop + top + el.offsetHeight * share;
        return Math.min(1, Math.max(0, (y - from) / (to - from)));
      }
    };
  }

  /* ---------- etapas ---------- */

  function setStage(next) {
    stage = next;
    root.setAttribute('data-stage', next);
    label.textContent = STAGES[next].label;
    status.textContent = STAGES[next].status;
    var idx = next === 'done' ? STEP_ORDER.length : STEP_ORDER.indexOf(next);
    stepEls.forEach(function (li, i) {
      var state = i < idx ? 'done' : i === idx ? 'current' : 'waiting';
      li.setAttribute('data-state', state);
      li.querySelector('.step-state').textContent =
        state === 'done' ? 'Hecho' : state === 'current' ? 'En curso' : 'En espera';
    });
    pauseBtn.hidden = next === 'done';
    if (next === 'done') stopClock();
  }

  function progressAt(s) {
    var p;
    if (s < T_EXTRACT) p = 8 * (s / T_EXTRACT);
    else if (s < T_RANK) p = 8 + 70 * ((s - T_EXTRACT) / (T_RANK - T_EXTRACT));
    else if (s < T_DONE) p = 78 + 22 * ((s - T_RANK) / (T_DONE - T_RANK));
    else p = 100;
    return Math.min(100, p);
  }

  function renderProgress() {
    var p = progressAt(t);
    barFill.style.transform = 'scaleX(' + (p / 100).toFixed(4) + ')';
    var whole = Math.floor(p);
    if (whole !== lastPct) {
      lastPct = whole;
      pctEl.textContent = whole;
      bar.setAttribute('aria-valuenow', whole);
    }
  }

  function at(time, fn) { queue.push({ at: time, fn: fn }); }

  function enterReceived() {
    setStage('received');
    animate(desk, [
      { opacity: 0, transform: 'translateY(26px) scale(0.97)' },
      { opacity: 1, transform: 'none' }
    ], 700, EASE_OUT);
    if (!reduce && typeof slots[0].animate === 'function') {
      slots.forEach(function (s, i) {
        var a = s.animate([{ opacity: 0.3 }, { opacity: 0.9 }, { opacity: 0.3 }], {
          duration: 2000, delay: i * 200, iterations: Infinity, easing: 'ease-in-out'
        });
        if (!isRunning()) a.pause();
        loops.push(a);
      });
    }
  }

  function enterExtracting() {
    loops.forEach(function (a) { a.cancel(); });
    loops = [];
    setStage('extracting');
    fitLines();
    var g = geometry();
    scan.style.top = g.from + 'px';

    for (var k = 0; k < FINDS; k++) {
      (function (k) {
        var base = T_EXTRACT + k * SWEEP_EVERY;
        var start = base + SWEEP_DELAY;

        /* El escáner baja por la hoja */
        at(start, function () {
          animate(scan, [
            { offset: 0, opacity: 0, transform: 'translateY(0)' },
            { offset: 0.06, opacity: 1, transform: 'translateY(' + g.span * 0.06 + 'px)' },
            { offset: 0.94, opacity: 1, transform: 'translateY(' + g.span * 0.94 + 'px)' },
            { offset: 1, opacity: 0, transform: 'translateY(' + g.span + 'px)' }
          ], SWEEP * 1000, 'linear');
        });

        /* Primer barrido: una marca en cada párrafo leído */
        if (k === 0) {
          paras.forEach(function (p) {
            var tick = p.querySelector('.tick');
            var y = g.at(p, 0.5);
            if (y >= 1) return; // párrafo fuera de la página
            at(start + SWEEP * y, function () {
              tick.style.opacity = '';
              tick.style.transform = '';
              animate(tick, [
                { transform: 'scaleY(0)' },
                { transform: 'scaleY(1)' }
              ], 250, EASE_OUT);
            });
          });
        }

        /* El hallazgo de este barrido se resalta… */
        var mark = sheet.querySelector('[data-mark="' + k + '"]');
        var mIn = start + SWEEP * g.at(mark, 0);
        var mDur = Math.max(0.25, SWEEP * (g.at(mark, 1) - g.at(mark, 0)));
        at(mIn, function () {
          mark.style.backgroundSize = '100% 100%';
          animate(mark, [
            { backgroundSize: '0% 100%' },
            { backgroundSize: '100% 100%' }
          ], mDur * 1000, 'linear');
        });

        /* …y cae al riel como tarjeta; las anteriores bajan un puesto */
        at(mIn + mDur + 0.15, function () { land(k); });
      })(k);
    }
    queue.sort(function (a, b) { return a.at - b.at; });
  }

  function land(k) {
    var card = cards[k];
    landed.forEach(function (c, i) {
      setN(c, i + 1);
      animate(c, [
        { transform: 'translateY(' + slotPx(i) + 'px)' },
        { transform: 'translateY(' + slotPx(i + 1) + 'px)' }
      ], CARD_IN * 1000, EASE_IN_OUT);
    });
    landed.unshift(card);
    setN(card, 0);
    card.style.opacity = '';
    animate(card, [
      { opacity: 0, transform: 'translateY(-10px) scale(0.97)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], CARD_IN * 1000, EASE_OUT);
    waveFound += 1;
    label.textContent = 'Extrayendo · ' + waveFound + ' de ' + FINDS + ' hallazgos';
  }

  function enterRanking() {
    setStage('ranking');
    /* Cada tarjeta recibe su puntaje, de arriba abajo */
    landed.forEach(function (card, i) {
      var fill = card.querySelector('.meter-fill');
      at(T_RANK + 0.4 + i * 0.15, function () {
        fill.style.transform = '';
        animate(fill, [
          { transform: 'scaleX(0)' },
          { transform: 'scaleX(' + SCORES[cards.indexOf(card)] + ')' }
        ], 800, EASE_OUT);
      });
    });
    /* …y se reordenan, la de más peso arriba */
    at(T_RANK + 2.0, function () {
      landed.forEach(function (card, from) {
        var to = RANKED[cards.indexOf(card)];
        setN(card, to);
        if (to === from) return;
        animate(card, [
          { transform: 'translateY(' + slotPx(from) + 'px)' },
          { transform: 'translateY(' + slotPx(to) + 'px)' }
        ], 700, EASE_IN_OUT);
      });
    });
    queue.sort(function (a, b) { return a.at - b.at; });
  }

  /* ---------- reloj ---------- */

  function isRunning() {
    return !userPaused && !offscreen && !document.hidden && stage !== 'done';
  }

  function tick(now) {
    raf = 0;
    if (!isRunning()) return;
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    t += dt;
    while (queue.length && queue[0].at <= t) queue.shift().fn();
    renderProgress();
    if (stage !== 'done') raf = requestAnimationFrame(tick);
  }

  function startClock() {
    if (raf || !isRunning()) return;
    last = 0;
    anims.concat(loops).forEach(function (a) { a.play(); });
    raf = requestAnimationFrame(tick);
  }

  function stopClock() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (stage !== 'done') anims.concat(loops).forEach(function (a) { a.pause(); });
  }

  function sync() {
    if (isRunning()) startClock();
    else stopClock();
  }

  /* ---------- reinicio ---------- */

  function reset() {
    stopClock();
    cancelAll();
    queue = [];
    landed = [];
    waveFound = 0;
    t = 0;
    lastPct = -1;
    userPaused = false;
    pauseBtn.textContent = 'Pausar';

    fitLines();
    paras.forEach(function (p) {
      var tk = p.querySelector('.tick');
      tk.style.opacity = '0';
      tk.style.transform = 'scaleY(0)';
    });
    [].forEach.call(sheet.querySelectorAll('.hl'), function (h) { h.style.backgroundSize = '0% 100%'; });
    cards.forEach(function (c) {
      c.style.opacity = '0';
      setN(c, 0);
      c.querySelector('.meter-fill').style.transform = 'scaleX(0)';
    });

    enterReceived();
    at(T_EXTRACT, enterExtracting);
    at(T_RANK, enterRanking);
    at(T_DONE, function () { setStage('done'); });
    renderProgress();
    sync();
  }

  pauseBtn.addEventListener('click', function () {
    userPaused = !userPaused;
    pauseBtn.textContent = userPaused ? 'Reanudar' : 'Pausar';
    sync();
  });
  restartBtn.addEventListener('click', reset);

  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      offscreen = !entries[0].isIntersecting;
      sync();
    }).observe(root);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { if (stage === 'received') fitLines(); });
  }

  reset();
})();
