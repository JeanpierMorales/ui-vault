(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var stack = document.querySelector('[data-stack]');
  if (!stack) return;

  var cards = Array.prototype.slice.call(stack.querySelectorAll('.card'));
  var panels = cards.map(function (c) { return c.querySelector('.panel'); });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var SHRINK = 0.06;   // how much a covered card recedes
  var DIM = 0.6;       // how dark it gets under the next one
  var visible = false;
  var queued = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    queued = false;
    if (reduced.matches) return;
    for (var i = 0; i < cards.length - 1; i++) {
      var a = cards[i].getBoundingClientRect();
      var b = cards[i + 1].getBoundingClientRect();
      // 0 while the next card is still below, 1 once it has slid fully over this one
      var p = clamp((a.height - (b.top - a.top)) / a.height);
      panels[i].style.setProperty('--s', (1 - p * SHRINK).toFixed(4));
      panels[i].style.setProperty('--d', (p * DIM).toFixed(3));
    }
  }

  function request() {
    if (!visible || queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  function reset() {
    panels.forEach(function (p) { p.style.removeProperty('--s'); p.style.removeProperty('--d'); });
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);

  if (reduced.addEventListener) {
    reduced.addEventListener('change', function () { reduced.matches ? reset() : request(); });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      request();
    }).observe(stack);
  } else {
    visible = true;
  }

  update();
})();
