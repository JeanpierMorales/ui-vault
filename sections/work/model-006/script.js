(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var rail = document.querySelector('[data-rail]');
  if (!rail) return;

  var pin = rail.querySelector('[data-pin]');
  var track = rail.querySelector('[data-track]');
  var panels = Array.prototype.slice.call(track.querySelectorAll('.panel'));
  var currentOut = rail.querySelector('[data-current]');
  var fill = rail.querySelector('[data-fill]');
  var mq = window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');

  var N = panels.length;
  var distance = 0;     // horizontal travel while pinned
  var pinned = false;
  var visible = true;
  var queued = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function report(p) {
    fill.style.setProperty('--p', Math.max(1 / N, p).toFixed(4));
    currentOut.textContent = pad(Math.min(N, Math.round(p * (N - 1)) + 1));
  }

  function measure() {
    if (!pinned) return;
    distance = Math.max(0, track.scrollWidth - pin.clientWidth);
    // the rail is as tall as the horizontal travel plus one screen
    rail.style.height = (pin.clientHeight + distance) + 'px';
  }

  function progress() {
    var top = rail.getBoundingClientRect().top;
    return distance ? Math.min(1, Math.max(0, -top / distance)) : 0;
  }

  function update() {
    queued = false;
    if (pinned) {
      var p = progress();
      track.style.setProperty('--x', (-p * distance).toFixed(1) + 'px');
      report(p);
    } else {
      var max = track.scrollWidth - track.clientWidth;
      report(max > 0 ? track.scrollLeft / max : 0);
    }
  }

  function request() {
    if (queued || !visible) return;
    queued = true;
    requestAnimationFrame(update);
  }

  function setMode() {
    pinned = mq.matches;
    rail.classList.toggle('is-pinned', pinned);
    if (pinned) {
      track.scrollLeft = 0;
      measure();
    } else {
      rail.style.height = '';
      track.style.removeProperty('--x');
    }
    update();
  }

  // Keyboard: tabbing to a case scrolls the page so that case is in view.
  track.addEventListener('focusin', function (e) {
    if (!pinned) return;
    var panel = e.target.closest('.panel');
    if (!panel) return;
    var i = panels.indexOf(panel);
    var x = Math.min(distance, panel.offsetLeft - panels[0].offsetLeft);
    var railTop = rail.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, railTop + x);
    // the browser may have nudged the pinned box to reveal the focus target
    pin.scrollLeft = 0;
    request();
    if (i === 0) window.scrollTo(0, railTop);
  });

  window.addEventListener('scroll', request, { passive: true });
  track.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { measure(); request(); });
  if (mq.addEventListener) mq.addEventListener('change', setMode);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      request();
    }).observe(rail);
  }

  // images change panel widths only via height; re-measure once they settle
  window.addEventListener('load', function () { measure(); update(); });

  setMode();
})();
