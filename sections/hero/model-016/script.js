(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var hero = document.querySelector('.hero');
  var collage = hero.querySelector('.collage');
  var photos = Array.prototype.slice.call(hero.querySelectorAll('.ph'));
  var detail = document.getElementById('detail');
  var panel = detail.querySelector('.detail-panel');
  var sheet = detail.querySelector('.detail-sheet');
  var scrim = detail.querySelector('.detail-scrim');
  var media = detail.querySelector('.detail-media');
  var mediaImg = media.querySelector('img');
  var info = detail.querySelector('.detail-info');
  var closeBtn = detail.querySelector('.detail-close');
  var titleEl = detail.querySelector('#detail-title');
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  var DATA = {
    torno: {
      kicker: 'Taller · Sábados',
      name: 'Clase de torno',
      price: 'S/ 180 por sesión',
      desc: 'Tres horas en el torno con Lucía, desde centrar el barro hasta tornear tu primer cuenco. Te llevas dos piezas quemadas y esmaltadas.',
      specs: [['Horario', 'Sábados, 10:00 a 13:00'], ['Grupo', 'Máximo 6 personas'], ['Incluye', 'Arcilla, esmalte y quema']],
      cta: 'Reservar un sábado'
    },
    taza: {
      kicker: 'Vajilla · Gres',
      name: 'Taza Oreja',
      price: 'S/ 58',
      desc: 'Taza sin asa, pensada para cafés largos y manos frías. Base sin esmaltar para que se sienta el barro.',
      specs: [['Capacidad', '320 ml'], ['Esmalte', 'Ceniza mate'], ['Uso', 'Apta para microondas y lavavajillas']],
      cta: 'Añadir a la mesa'
    },
    horno: {
      kicker: 'Taller · Servicio',
      name: 'Quema de gres',
      price: 'S/ 35 por pieza',
      desc: 'Si tornas en casa, trae tus piezas secas. Las quemamos en nuestro horno a 1 240 °C los jueves y las recoges el lunes.',
      specs: [['Temperatura', '1 240 °C, cono 6'], ['Ciclo', 'Jueves a lunes'], ['Tamaño', 'Hasta 35 cm de alto']],
      cta: 'Agendar una quema'
    },
    bowl: {
      kicker: 'Vajilla · Gres',
      name: 'Bowl Neblina',
      price: 'S/ 64',
      desc: 'Bowl hondo para caldos, ceviche o avena. El esmalte crema se vuelve más gris donde el barro es más delgado.',
      specs: [['Medidas', '16 cm × 8 cm'], ['Esmalte', 'Crema neblina'], ['Uso', 'Apto para lavavajillas']],
      cta: 'Añadir a la mesa'
    },
    jarron: {
      kicker: 'Objetos · Gres',
      name: 'Jarrón Pampa',
      price: 'S/ 240',
      desc: 'Jarrón de cuello corto para una sola rama. Torneado en dos partes y unido a mano, así que no hay dos iguales.',
      specs: [['Alto', '32 cm'], ['Esmalte', 'Blanco mate por fuera'], ['Interior', 'Vidriado, contiene agua']],
      cta: 'Reservar pieza'
    },
    set: {
      kicker: 'Vajilla · Set para cuatro',
      name: 'Set Domingo',
      price: 'S/ 690',
      desc: 'Cuatro platos, cuatro bowls y cuatro tazas del mismo lote de horno, para que el esmalte combine de verdad.',
      specs: [['Piezas', '12'], ['Esmalte', 'Crudo con borde óxido'], ['Entrega', '3 a 4 semanas']],
      cta: 'Pedir el set'
    },
    plato: {
      kicker: 'Vajilla · Gres',
      name: 'Plato Malecón',
      price: 'S/ 72',
      desc: 'Plato hondo de ala ancha, el que más usamos en el taller para almorzar. Aguanta el horno de casa sin problema.',
      specs: [['Medidas', '22 cm de diámetro'], ['Esmalte', 'Blanco roto'], ['Uso', 'Horno, microondas y lavavajillas']],
      cta: 'Añadir a la mesa'
    }
  };

  function reduced() { return reduceMq.matches; }

  /* ---------- load: fly in from the headline ---------- */
  function visiblePhotos() {
    return photos.filter(function (p) { return p.offsetParent !== null; });
  }

  function prepareFlyIn() {
    var hr = hero.getBoundingClientRect();
    var cx = hr.left + hr.width / 2;
    var cy = hr.top + hr.height / 2;
    visiblePhotos().forEach(function (p, i) {
      var r = p.getBoundingClientRect();
      var fx = (cx - (r.left + r.width / 2)) * 0.3;
      var fy = (cy - (r.top + r.height / 2)) * 0.3 + 30;
      var btn = p.querySelector('.ph-btn');
      btn.style.setProperty('--fx', fx.toFixed(1) + 'px');
      btn.style.setProperty('--fy', fy.toFixed(1) + 'px');
      btn.style.setProperty('--i', i);
    });
  }

  function start() {
    prepareFlyIn();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('is-in');
        setTimeout(function () { hero.classList.add('is-ready'); }, 1800);
      });
    });
  }

  var imgs = photos.map(function (p) { return p.querySelector('img'); });
  var ready = Promise.all(imgs.map(function (img) {
    if (img.complete) return Promise.resolve();
    return new Promise(function (res) {
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }));
  var started = false;
  function go() { if (!started) { started = true; start(); } }
  ready.then(go);
  setTimeout(go, 1600);

  /* ---------- depth: pointer parallax + idle drift ---------- */
  var MAX = 24;
  var target = { x: 0, y: 0 };
  var cur = { x: 0, y: 0 };
  var layers = photos.map(function (p, i) {
    return { el: p, d: parseFloat(p.getAttribute('data-depth')) || 0.5, ph: i * 1.7 };
  });
  var rafId = 0;
  var inView = true;
  var paused = false;

  function frame(t) {
    rafId = 0;
    cur.x += (target.x - cur.x) * 0.075;
    cur.y += (target.y - cur.y) * 0.075;
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      var dx = Math.sin(t / 5200 + L.ph) * 5 * L.d;
      var dy = Math.cos(t / 6100 + L.ph) * 4 * L.d;
      var x = -cur.x * MAX * L.d + dx;
      var y = -cur.y * MAX * L.d + dy;
      L.el.style.translate = x.toFixed(2) + 'px ' + y.toFixed(2) + 'px';
    }
    loop();
  }

  function loop() {
    if (rafId || paused || !inView || document.hidden || reduced()) return;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function resetDepth() {
    stop();
    cur.x = cur.y = target.x = target.y = 0;
    layers.forEach(function (L) { L.el.style.translate = ''; });
  }

  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var r = hero.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  hero.addEventListener('pointerleave', function () { target.x = 0; target.y = 0; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) loop(); else stop();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else loop();
  });
  function onMotionPref() {
    if (reduced()) resetDepth(); else loop();
  }
  if (reduceMq.addEventListener) reduceMq.addEventListener('change', onMotionPref);
  else if (reduceMq.addListener) reduceMq.addListener(onMotionPref);
  loop();

  /* ---------- detail view with FLIP ---------- */
  var activePhoto = null;
  var lastFocus = null;
  var busy = false;

  function fill(d, img) {
    detail.querySelector('.detail-kicker').textContent = d.kicker;
    titleEl.textContent = d.name;
    detail.querySelector('.detail-price').textContent = d.price;
    detail.querySelector('.detail-desc').textContent = d.desc;
    detail.querySelector('.detail-cta').textContent = d.cta;
    var dl = detail.querySelector('.detail-specs');
    dl.textContent = '';
    d.specs.forEach(function (s) {
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = s[0];
      dd.textContent = s[1];
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
    mediaImg.src = img.currentSrc || img.src;
    mediaImg.alt = img.alt;
  }

  // transform + clip that make the big media look exactly like the small photo
  function flipFrom(first) {
    var last = media.getBoundingClientRect();
    var s = Math.max(first.width / last.width, first.height / last.height);
    var ix = Math.max(0, (last.width - first.width / s) / 2);
    var iy = Math.max(0, (last.height - first.height / s) / 2);
    var dx = (first.left + first.width / 2) - (last.left + last.width / 2);
    var dy = (first.top + first.height / 2) - (last.top + last.height / 2);
    return {
      transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + s + ')',
      clipPath: 'inset(' + iy + 'px ' + ix + 'px round ' + (16 / s) + 'px)'
    };
  }
  var REST = { transform: 'translate(0px, 0px) scale(1)', clipPath: 'inset(0px 0px round 16px)' };

  function setInert(on) {
    Array.prototype.forEach.call(hero.children, function (el) {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function open(li) {
    if (busy || activePhoto) return;
    var btn = li.querySelector('.ph-btn');
    var d = DATA[btn.getAttribute('data-id')];
    if (!d) return;
    activePhoto = li;
    lastFocus = btn;
    paused = true;
    stop();

    fill(d, btn.querySelector('img'));
    detail.hidden = false;
    hero.classList.add('is-dim');
    setInert(true);

    if (reduced()) {
      li.classList.add('is-active');
      closeBtn.focus();
      return;
    }

    busy = true;
    var first = btn.getBoundingClientRect();
    detail.classList.add('is-animating');
    var from = flipFrom(first);
    li.classList.add('is-active');
    var dur = 640;
    var a = media.animate([from, REST], { duration: dur, easing: EASE });
    scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
    sheet.animate([{ opacity: 0, transform: 'scale(0.98)' }, { opacity: 1, transform: 'none' }],
      { duration: 460, delay: 80, easing: EASE, fill: 'backwards' });
    info.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 520, delay: 200, easing: EASE, fill: 'backwards' });
    closeBtn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 260, fill: 'backwards' });
    a.onfinish = function () {
      detail.classList.remove('is-animating');
      busy = false;
      closeBtn.focus({ preventScroll: true });
    };
  }

  function finishClose() {
    detail.hidden = true;
    detail.classList.remove('is-animating');
    if (activePhoto) activePhoto.classList.remove('is-active');
    hero.classList.remove('is-dim');
    setInert(false);
    activePhoto = null;
    busy = false;
    paused = false;
    if (lastFocus) lastFocus.focus({ preventScroll: true });
    loop();
  }

  function close() {
    if (busy || !activePhoto) return;
    if (reduced()) { finishClose(); return; }
    busy = true;
    detail.classList.add('is-animating');
    panel.scrollTop = 0;
    var first = activePhoto.querySelector('.ph-btn').getBoundingClientRect();
    var to = flipFrom(first);
    hero.classList.remove('is-dim');
    var dur = 520;
    var a = media.animate([REST, to], { duration: dur, easing: EASE, fill: 'forwards' });
    info.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    closeBtn.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
    sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
    scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'ease-out', fill: 'forwards' });
    a.onfinish = function () {
      finishClose();
      [media, info, closeBtn, sheet, scrim].forEach(function (el) {
        el.getAnimations().forEach(function (an) { an.cancel(); });
      });
    };
  }

  collage.addEventListener('click', function (e) {
    var btn = e.target.closest('.ph-btn');
    if (btn) open(btn.closest('.ph'));
  });
  closeBtn.addEventListener('click', close);
  scrim.addEventListener('click', close);
  detail.querySelector('.detail-cta').addEventListener('click', function (e) { e.preventDefault(); close(); });

  detail.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; }
    );
    if (!f.length) return;
    var firstEl = f[0];
    var lastEl = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === firstEl || !panel.contains(document.activeElement))) {
      e.preventDefault(); lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault(); firstEl.focus();
    }
  });
  // Escape also works if focus somehow left the dialog
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activePhoto && !detail.contains(e.target)) { e.preventDefault(); close(); }
  });
})();
