(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var deck = document.querySelector('[data-deck]');
  if (!deck) return;

  var strip = deck.querySelector('[data-strip]');
  var tabs = Array.prototype.slice.call(deck.querySelectorAll('[role="tab"]'));
  var cases = Array.prototype.slice.call(deck.querySelectorAll('.case'));
  var shots = Array.prototype.slice.call(deck.querySelectorAll('.shot'));
  var tcOut = deck.querySelector('[data-tc]');
  var countOut = deck.querySelector('[data-count]');
  var playBtn = deck.querySelector('[data-play]');
  var playLabel = deck.querySelector('[data-play-label]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var N = tabs.length;
  var FPS = 24;
  var SEGMENT_MS = 3200;              // time the playhead spends on each cut while playing
  var durs = tabs.map(function (t) { return Number(t.getAttribute('data-dur')) || 30; });
  var starts = [];
  durs.reduce(function (acc, d, i) { starts[i] = acc; return acc + d; }, 0);

  var current = -1;
  var frac = 0.5 / N;
  var playing = false;
  var visible = true;
  var raf = 0;
  var last = 0;
  var stepAcc = 0;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function timecode(f) {
    var x = Math.max(0, Math.min(0.99999, f)) * N;
    var i = Math.floor(x);
    var secs = starts[i] + (x - i) * durs[i];
    var whole = Math.floor(secs);
    var fr = Math.floor((secs - whole) * FPS);
    return pad(Math.floor(whole / 3600)) + ':' + pad(Math.floor(whole / 60) % 60) + ':' + pad(whole % 60) + ':' + pad(fr);
  }

  function select(i) {
    if (i === current) return;
    current = i;
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    cases.forEach(function (c, n) { c.hidden = n !== i; });
    shots.forEach(function (s, n) {
      s.classList.toggle('is-current', n === i);
      if (n === i) s.loading = 'eager';
    });
    // warm the next still so scrubbing never shows an empty frame
    if (shots[(i + 1) % N]) shots[(i + 1) % N].loading = 'eager';
    countOut.textContent = pad(i + 1);
  }

  function setFrac(f) {
    frac = Math.max(0, Math.min(1, f));
    var w = strip.clientWidth;
    strip.style.setProperty('--ph', (frac * w).toFixed(1) + 'px');
    strip.style.setProperty('--pf', frac.toFixed(4));
    tcOut.textContent = timecode(frac);
    select(Math.min(N - 1, Math.floor(frac * N)));
  }

  function goTo(i) {
    setFrac((i + 0.5) / N);
  }

  /* ---------- Scrubbing ---------- */

  var drag = null;

  function fracFromEvent(e) {
    var r = strip.getBoundingClientRect();
    return (e.clientX - r.left) / r.width;
  }

  strip.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    stop();
    drag = { id: e.pointerId, x: e.clientX, moved: false };
    strip.setPointerCapture(e.pointerId);
  });

  strip.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x) < 4) return;
    drag.moved = true;
    deck.classList.add('is-scrubbing');
    setFrac(fracFromEvent(e));
  });

  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var moved = drag.moved;
    drag = null;
    deck.classList.remove('is-scrubbing');
    // a plain tap lands on the tapped cut
    if (!moved && e.type === 'pointerup') goTo(Math.min(N - 1, Math.floor(fracFromEvent(e) * N)));
  }
  strip.addEventListener('pointerup', endDrag);
  strip.addEventListener('pointercancel', endDrag);

  /* ---------- Keyboard (tabs pattern) ---------- */

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function (e) {
      if (e.detail === 0) { stop(); goTo(i); }   // Enter / Space
    });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % N;
      else if (e.key === 'ArrowLeft') next = (i - 1 + N) % N;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = N - 1;
      if (next === null) return;
      e.preventDefault();
      stop();
      goTo(next);
      tabs[next].focus();
    });
  });

  Array.prototype.forEach.call(deck.querySelectorAll('[data-step]'), function (btn) {
    btn.addEventListener('click', function () {
      stop();
      goTo((current + Number(btn.getAttribute('data-step')) + N) % N);
    });
  });

  /* ---------- Play the strip ---------- */

  function tick(now) {
    raf = 0;
    if (!playing || !visible || document.hidden) return;
    var dt = last ? Math.min(64, now - last) : 16;
    last = now;
    if (reduced.matches) {
      // no gliding playhead: hold each cut, then cut
      stepAcc += dt;
      if (stepAcc >= SEGMENT_MS) { stepAcc = 0; goTo((current + 1) % N); }
    } else {
      var f = frac + dt / (SEGMENT_MS * N);
      setFrac(f >= 1 ? 0 : f);
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    playing = true;
    last = 0; stepAcc = 0;
    deck.classList.add('is-playing');
    playBtn.setAttribute('aria-pressed', 'true');
    playLabel.textContent = 'Pausar tira';
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (!playing) return;
    playing = false;
    cancelAnimationFrame(raf); raf = 0;
    deck.classList.remove('is-playing');
    playBtn.setAttribute('aria-pressed', 'false');
    playLabel.textContent = 'Reproducir tira';
  }

  playBtn.addEventListener('click', function () { playing ? stop() : start(); });

  function resume() {
    if (playing && visible && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(tick); }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(raf); raf = 0; } else resume();
    }).observe(deck);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else resume();
  });

  window.addEventListener('resize', function () { setFrac(frac); });

  goTo(0);
})();
