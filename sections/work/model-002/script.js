(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var index = document.querySelector('[data-index]');
  if (!index) return;

  var preview = index.querySelector('.preview');
  var frames = Array.prototype.slice.call(index.querySelectorAll('[data-preview]'));
  var rows = Array.prototype.slice.call(index.querySelectorAll('.row'));
  var list = index.querySelector('.rows');

  var fine = window.matchMedia('(hover: hover) and (min-width: 761px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var OFFSET = 36;
  var state = {
    active: false,
    current: -1,
    px: 0, py: 0,          // pointer, client coords
    tx: 0, ty: 0,          // target, index coords
    x: 0, y: 0,            // rendered
    r: 0,
    raf: 0,
    visible: true,
    hasPointer: false
  };

  function show(i) {
    if (i === state.current) return;
    state.current = i;
    frames.forEach(function (img, n) { img.classList.toggle('is-current', n === i); });
  }

  function size() {
    return { w: preview.offsetWidth, h: preview.offsetHeight, W: index.clientWidth };
  }

  // Place the card to the right of the cursor; flip to the left near the edge.
  function targetFromPointer() {
    var box = index.getBoundingClientRect();
    var s = size();
    var lx = state.px - box.left;
    var ly = state.py - box.top;
    var x = lx + OFFSET;
    if (x + s.w > s.W) x = lx - OFFSET - s.w;
    state.tx = Math.max(0, Math.min(x, s.W - s.w));
    state.ty = ly - s.h / 2;
  }

  // Keyboard focus: dock the card beside the row, over the right-hand columns.
  function targetFromRow(row) {
    var box = index.getBoundingClientRect();
    var r = row.getBoundingClientRect();
    var s = size();
    state.tx = Math.max(0, s.W - s.w - s.W * 0.2);
    state.ty = r.top - box.top + r.height / 2 - s.h / 2;
  }

  function render() {
    preview.style.setProperty('--x', state.x.toFixed(1) + 'px');
    preview.style.setProperty('--y', state.y.toFixed(1) + 'px');
    preview.style.setProperty('--r', state.r.toFixed(2) + 'deg');
  }

  function tick() {
    state.raf = 0;
    var dx = state.tx - state.x;
    var dy = state.ty - state.y;
    state.x += dx * 0.16;
    state.y += dy * 0.16;
    // tilt follows horizontal speed, like a print held by one corner
    var targetR = Math.max(-7, Math.min(7, dx * 0.06));
    state.r += (targetR - state.r) * 0.2;
    render();
    var settled = Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3 && Math.abs(state.r) < 0.05;
    if (!settled && state.visible && !document.hidden) loop();
  }

  function loop() {
    if (!state.raf) state.raf = requestAnimationFrame(tick);
  }

  function snap() {
    state.x = state.tx; state.y = state.ty; state.r = 0;
    render();
  }

  function activate(i, fromKeyboard) {
    if (!fine.matches) return;
    show(i);
    var wasOff = !state.active;
    state.active = true;
    preview.classList.add('is-on');
    if (wasOff || reduced.matches || fromKeyboard) snap();
    else loop();
  }

  function deactivate() {
    state.active = false;
    preview.classList.remove('is-on');
  }

  rows.forEach(function (row) {
    var i = Number(row.getAttribute('data-img'));

    row.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      state.px = e.clientX; state.py = e.clientY; state.hasPointer = true;
      targetFromPointer();
      activate(i, false);
    });

    row.addEventListener('focus', function () {
      if (!row.matches(':focus-visible')) return;
      targetFromRow(row);
      activate(i, true);
    });

    row.addEventListener('blur', function () {
      if (!list.matches(':hover')) deactivate();
    });
  });

  index.addEventListener('pointermove', function (e) {
    if (!state.active || e.pointerType === 'touch') return;
    state.px = e.clientX; state.py = e.clientY;
    targetFromPointer();
    if (reduced.matches) snap(); else loop();
  });

  list.addEventListener('pointerleave', deactivate);

  // Content scrolls under a still cursor: keep the card attached to it.
  window.addEventListener('scroll', function () {
    if (!state.active || !state.hasPointer || document.activeElement && document.activeElement.classList.contains('row')) return;
    targetFromPointer();
    if (reduced.matches) snap(); else loop();
  }, { passive: true });

  fine.addEventListener('change', function () { if (!fine.matches) deactivate(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      state.visible = entries[0].isIntersecting;
      if (!state.visible) {
        cancelAnimationFrame(state.raf); state.raf = 0;
        deactivate();
      }
    }).observe(index);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { cancelAnimationFrame(state.raf); state.raf = 0; }
  });
})();
