(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var filters = document.querySelector('[data-filters]');
  var grid = document.querySelector('[data-grid]');
  var status = document.querySelector('[data-status]');
  if (!filters || !grid) return;

  var chips = Array.prototype.slice.call(filters.querySelectorAll('.chip'));
  var items = Array.prototype.slice.call(grid.querySelectorAll('.item'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canAnimate = typeof Element.prototype.animate === 'function';

  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  var active = 'todo';
  var token = 0;

  function matches(item, f) {
    return f === 'todo' || item.getAttribute('data-cat') === f;
  }

  function cancelAll() {
    items.forEach(function (el) {
      if (el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); });
    });
  }

  function announce(f, n) {
    var chip = chips.filter(function (c) { return c.getAttribute('data-filter') === f; })[0];
    var label = chip ? chip.firstChild.textContent.trim() : '';
    status.textContent = f === 'todo'
      ? 'Mostrando los ' + n + ' proyectos.'
      : 'Mostrando ' + n + (n === 1 ? ' proyecto' : ' proyectos') + ' de ' + label.toLowerCase() + '.';
  }

  function apply(f) {
    if (f === active) return;
    active = f;
    var run = ++token;

    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', c.getAttribute('data-filter') === f ? 'true' : 'false');
    });

    var leaving = items.filter(function (el) { return !el.hidden && !matches(el, f); });
    var entering = items.filter(function (el) { return el.hidden && matches(el, f); });
    var staying = items.filter(function (el) { return !el.hidden && matches(el, f); });
    var count = staying.length + entering.length;

    if (!canAnimate || reduced.matches) {
      grid.classList.toggle('is-filtered', f !== 'todo');
      leaving.forEach(function (el) { el.hidden = true; });
      entering.forEach(function (el) { el.hidden = false; });
      if (canAnimate && reduced.matches) {
        entering.forEach(function (el) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease' }); });
      }
      announce(f, count);
      return;
    }

    cancelAll();

    // 1. leaving cards fade and shrink in place
    var exits = leaving.map(function (el) {
      return el.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }],
        { duration: 200, easing: 'ease-in', fill: 'forwards' }
      ).finished.catch(function () {});
    });

    Promise.all(exits).then(function () {
      if (run !== token) return;

      // 2. FLIP: First
      var first = new Map();
      staying.forEach(function (el) { first.set(el, el.getBoundingClientRect()); });

      leaving.forEach(function (el) {
        el.hidden = true;
        el.getAnimations().forEach(function (a) { a.cancel(); });
      });
      entering.forEach(function (el) { el.hidden = false; });
      grid.classList.toggle('is-filtered', f !== 'todo');

      // Last, Invert, Play — position only, so photos never stretch
      staying.forEach(function (el) {
        var a = first.get(el);
        var b = el.getBoundingClientRect();
        var dx = a.left - b.left;
        var dy = a.top - b.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        el.animate(
          [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }],
          { duration: 620, easing: EASE }
        );
      });

      entering.forEach(function (el, i) {
        el.animate(
          [{ opacity: 0, transform: 'translateY(18px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
          { duration: 520, delay: 120 + i * 60, easing: EASE, fill: 'backwards' }
        );
      });

      announce(f, count);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { apply(chip.getAttribute('data-filter')); });
  });
})();
