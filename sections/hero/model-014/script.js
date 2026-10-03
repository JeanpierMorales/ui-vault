(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- giant headline: fit the text edge to edge ---------- */
  var h1 = document.querySelector('.headline');
  var fit = document.querySelector('[data-fit]');

  function fitHeadline() {
    if (!h1 || !fit) return;
    var avail = h1.clientWidth;
    if (!avail) return;
    h1.style.fontSize = '100px';
    var w = fit.getBoundingClientRect().width;
    if (!w) return;
    var size = Math.floor((100 * avail / w) * 0.995 * 100) / 100;
    h1.style.fontSize = size + 'px';
  }

  var raf = 0;
  function queueFit() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitHeadline);
  }

  fitHeadline();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeadline);
  if ('ResizeObserver' in window && h1) new ResizeObserver(queueFit).observe(h1);
  else window.addEventListener('resize', queueFit);

  /* ---------- image accordion ---------- */
  var acc = document.querySelector('[data-acc]');
  if (!acc) return;
  var panels = Array.prototype.slice.call(acc.querySelectorAll('.panel'));
  var triggers = panels.map(function (p) { return p.querySelector('.trigger'); });
  var current = Math.max(0, panels.findIndex(function (p) { return p.classList.contains('is-open'); }));
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var hoverTimer = 0;

  function open(i) {
    if (i === current) return;
    current = i;
    panels.forEach(function (p, k) {
      var on = k === i;
      p.classList.toggle('is-open', on);
      triggers[k].setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }

  panels.forEach(function (p, i) {
    var t = triggers[i];
    t.addEventListener('click', function () { open(i); });
    t.addEventListener('focus', function () { open(i); });
    p.addEventListener('mouseenter', function () {
      if (!canHover.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { open(i); }, 70);
    });
    p.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });

    t.addEventListener('keydown', function (e) {
      var next = null;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': next = (i + 1) % panels.length; break;
        case 'ArrowLeft': case 'ArrowUp': next = (i - 1 + panels.length) % panels.length; break;
        case 'Home': next = 0; break;
        case 'End': next = panels.length - 1; break;
      }
      if (next === null) return;
      e.preventDefault();
      triggers[next].focus();
    });
  });
})();
