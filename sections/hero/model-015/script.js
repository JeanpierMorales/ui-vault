(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var hero = document.querySelector('.hero');
  var stage = document.querySelector('[data-stage]');
  var nav = document.querySelector('[data-nav]');
  var ghost = document.querySelector('[data-ghost]');
  var frame = document.querySelector('[data-frame]');
  var halfL = document.querySelector('[data-half="l"]');
  var halfR = document.querySelector('[data-half="r"]');
  var intro = document.querySelector('[data-intro]');
  var hint = document.querySelector('[data-hint]');
  var imgA = document.querySelector('[data-img-a]');
  var imgB = document.querySelector('[data-img-b]');
  var scrim = document.querySelector('.media__scrim');
  var caption = document.querySelector('[data-caption]');
  var viewA = document.querySelector('[data-view-a]');
  var viewB = document.querySelector('[data-view-b]');
  var progress = document.querySelector('[data-progress]');
  var progressTrack = document.querySelector('.progress');
  var toggle = document.querySelector('[data-toggle]');
  var menu = document.querySelector('[data-menu]');

  if (!hero || !stage || !frame) return;

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !nav.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Scroll scene ---------- */
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var geo = { sw: 0, sh: 0, cw: 0, ch: 0, vertical: false };
  var ticking = false;
  var active = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function range(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function measure() {
    geo.sw = stage.clientWidth;
    geo.sh = stage.clientHeight;
    geo.cw = ghost.offsetWidth;
    geo.ch = ghost.offsetHeight;
    geo.vertical = window.matchMedia('(max-width: 640px), (max-width: 1024px) and (orientation: portrait)').matches;
  }

  function progressOf() {
    var r = hero.getBoundingClientRect();
    var dist = hero.offsetHeight - stage.offsetHeight;
    return dist > 0 ? clamp(-r.top / dist, 0, 1) : 0;
  }

  function render() {
    ticking = false;
    if (!active) return;
    var p = progressOf();

    // Beat 1 (0 → 0.46): card grows to full bleed, headline halves part
    var e = easeInOut(range(p, 0.02, 0.46));
    var insX = ((geo.sw - geo.cw) / 2) * (1 - e);
    var insY = ((geo.sh - geo.ch) / 2) * (1 - e);
    var rad = 20 * (1 - e);
    frame.style.clipPath = 'inset(' + insY.toFixed(2) + 'px ' + insX.toFixed(2) + 'px round ' + rad.toFixed(2) + 'px)';
    imgA.style.transform = 'scale(' + (1.18 - 0.18 * e).toFixed(4) + ')';

    var push = easeOut(range(p, 0.02, 0.4));
    var fade = 1 - range(p, 0.06, 0.34);
    if (geo.vertical) {
      var dy = push * geo.sh * 0.32;
      halfL.style.transform = 'translate3d(0,' + (-dy).toFixed(1) + 'px,0)';
      halfR.style.transform = 'translate3d(0,' + dy.toFixed(1) + 'px,0)';
    } else {
      var dx = push * geo.sw * 0.34;
      halfL.style.transform = 'translate3d(' + (-dx).toFixed(1) + 'px,0,0)';
      halfR.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,0,0)';
    }
    halfL.style.opacity = halfR.style.opacity = fade.toFixed(3);

    var introFade = 1 - range(p, 0.0, 0.14);
    intro.style.opacity = introFade.toFixed(3);
    hint.style.opacity = (1 - range(p, 0.0, 0.08)).toFixed(3);

    scrim.style.opacity = range(p, 0.26, 0.5).toFixed(3);
    nav.classList.toggle('is-over', p > 0.34);

    // Caption arrives once the image fills the viewport
    var c = easeOut(range(p, 0.46, 0.58));
    caption.style.opacity = c.toFixed(3);
    caption.style.visibility = c > 0.001 ? 'visible' : 'hidden';
    caption.style.transform = 'translate3d(0,' + ((1 - c) * 24).toFixed(1) + 'px,0)';

    // Beat 2 (0.58 → 1): crossfade to the wall detail, progress line fills
    progressTrack.style.opacity = c.toFixed(3);
    progress.style.transform = 'scaleX(' + range(p, 0.58, 0.98).toFixed(4) + ')';
    var x = range(p, 0.66, 0.9);
    imgB.style.opacity = x.toFixed(3);
    imgB.style.transform = 'scale(' + (1.08 - 0.08 * range(p, 0.6, 1)).toFixed(4) + ')';
    viewA.style.opacity = ((1 - x) * 0.8).toFixed(3);
    viewB.style.opacity = (x * 0.8).toFixed(3);
  }

  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  }

  function onResize() { if (active) { measure(); request(); } }

  var clearTargets = [frame, imgA, imgB, halfL, halfR, intro, hint, scrim, caption, viewA, viewB, progress, progressTrack];

  function enable() {
    active = true;
    root.classList.add('is-scrub');
    measure();
    render();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', onResize);
  }

  function disable() {
    active = false;
    root.classList.remove('is-scrub');
    window.removeEventListener('scroll', request);
    window.removeEventListener('resize', onResize);
    clearTargets.forEach(function (el) { if (el) el.removeAttribute('style'); });
    nav.classList.remove('is-over');
  }

  function sync() { if (reduceMq.matches) disable(); else enable(); }

  if (reduceMq.addEventListener) reduceMq.addEventListener('change', sync);
  else if (reduceMq.addListener) reduceMq.addListener(sync);

  sync();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
})();
