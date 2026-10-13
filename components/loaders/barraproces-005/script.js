(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var root = document.getElementById('upload');
  if (!root) return;

  var rows = Array.prototype.slice.call(root.querySelectorAll('.file'));
  var heroGlyph = document.getElementById('heroGlyph');
  var nowFile = document.getElementById('nowFile');
  var nowPct = document.getElementById('nowPct');
  var nowStage = document.getElementById('nowStage');
  var totalCount = document.getElementById('totalCount');
  var totalPct = document.getElementById('totalPct');
  var totalBar = document.getElementById('totalBar');
  var totalFill = totalBar.querySelector('.fill');
  var pauseBtn = document.getElementById('pauseBtn');
  var restartBtn = document.getElementById('restartBtn');
  var live = document.getElementById('live');

  /* Deterministic script: upload time (ms), processing time (ms), what the
     shop checks while processing, and one file whose connection drops. */
  var SPEC = [
    { up: 2200, proc: 1300, check: 'Revisando sangrado y fuentes incrustadas' },
    { up: 4600, proc: 1700, check: 'Revisando resolución (300 ppp) y perfil de color', failAt: 63 },
    { up: 2000, proc: 1200, check: 'Revisando sangrado y fuentes incrustadas' },
    { up: 1600, proc: 1100, check: 'Comprobando tamaño A5 y márgenes' },
    { up: 1400, proc: 1200, check: 'Separando la tinta dorada del monograma' }
  ];
  var TICK = 100;
  var GAP = 350;

  var files = rows.map(function (li, i) {
    return {
      li: li,
      name: li.querySelector('.file-name').textContent,
      metaText: li.querySelector('.file-meta').textContent,
      meta: li.querySelector('.file-meta'),
      state: li.querySelector('.file-state'),
      track: li.querySelector('.track'),
      fill: li.querySelector('.fill'),
      glyph: li.querySelector('.file-glyph'),
      retry: li.querySelector('.retry'),
      spec: SPEC[i],
      phase: 'queued',
      pct: 0,
      t: 0,
      failed: false
    };
  });

  var queue = [];
  var active = null;
  var gap = 0;
  var timer = null;
  var userPaused = false;
  var visible = true;
  var settled = false;

  /* ---------- glyphs (from the UPLOAD language) ---------- */
  var FILE = '<path d="M14 2.5H7A2 2 0 0 0 5 4.5v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5"/>';
  var GLYPHS = {
    queued: FILE,
    uploading: FILE + '<g data-g="arrow"><path d="M12 18v-6.5"/><path d="m9 14 3-3 3 3"/></g>',
    processing: FILE + '<path d="M8.5 12h7M8.5 15h7M8.5 18h4" opacity=".4"/><path data-g="scan" d="M7.5 10.5h9"/>',
    done: '<circle data-g="ring" cx="12" cy="12" r="10"/><path data-g="tick" d="m8 12 3 3 5-6"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>'
  };

  function svg(phase, width) {
    return '<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + width +
      '" stroke-linecap="round" stroke-linejoin="round">' + GLYPHS[phase] + '</svg>';
  }

  function say(text) {
    live.textContent = '';
    setTimeout(function () { live.textContent = text; }, 30);
  }

  /* ---------- painting ---------- */
  function setFill(fill, pct, phase) {
    fill.style.transform = 'translateX(' + (pct - 100) + '%)';
    fill.toggleAttribute('data-done', phase === 'done');
    fill.toggleAttribute('data-processing', phase === 'processing');
    fill.toggleAttribute('data-error', phase === 'error');
  }

  var STATE_WORD = { queued: 'En cola', processing: 'Revisando', done: 'Guardado', error: 'No se subió' };

  function paintRow(f, phaseChanged) {
    f.li.dataset.phase = f.phase;
    if (phaseChanged) f.glyph.innerHTML = svg(f.phase, 1.8);
    var pct = Math.round(f.pct);
    f.state.textContent = f.phase === 'uploading' ? pct + '%' : STATE_WORD[f.phase];
    f.meta.textContent = f.phase === 'error'
      ? 'Se cortó la conexión al ' + pct + '%. Tu archivo no se perdió: reinténtalo.'
      : f.metaText;
    setFill(f.fill, f.phase === 'processing' || f.phase === 'done' ? 100 : pct, f.phase);
    f.track.setAttribute('aria-valuenow', f.phase === 'processing' || f.phase === 'done' ? 100 : pct);
    f.track.setAttribute('aria-valuetext', f.phase === 'uploading' ? pct + '%' : STATE_WORD[f.phase]);
    f.retry.hidden = f.phase !== 'error';
  }

  function counts() {
    var done = 0, failed = 0, sum = 0;
    files.forEach(function (f) {
      if (f.phase === 'done') { done++; sum += 100; }
      else if (f.phase === 'processing') sum += 100;
      else if (f.phase === 'uploading' || f.phase === 'error') sum += f.pct;
      if (f.phase === 'error') failed++;
    });
    return { done: done, failed: failed, pct: Math.round(sum / files.length) };
  }

  var heroPhase = null;

  function paintHero(phase, file, pct, stage) {
    if (phase !== heroPhase) {
      heroGlyph.innerHTML = GLYPHS[phase];
      heroPhase = phase;
      root.dataset.hero = phase;
    }
    nowFile.textContent = file;
    nowPct.textContent = pct;
    nowStage.textContent = stage;
  }

  function paintTotal() {
    var c = counts();
    totalCount.innerHTML = '<strong>' + c.done + '</strong> de ' + files.length + ' subidos' +
      (c.failed ? ' · ' + c.failed + ' falló' : '');
    totalPct.textContent = c.pct;
    totalBar.setAttribute('aria-valuenow', c.pct);
    var all = c.done === files.length;
    totalFill.style.transform = 'translateX(' + (c.pct - 100) + '%)';
    totalFill.toggleAttribute('data-done', all);
    return c;
  }

  function paint() {
    var c = paintTotal();
    if (active) {
      var f = active;
      if (f.phase === 'uploading') {
        paintHero('uploading', 'Subiendo ' + f.name, Math.round(f.pct), f.failed
          ? 'Segundo intento. Ya no compite con otros archivos.'
          : 'Archivo ' + (files.indexOf(f) + 1) + ' de ' + files.length + ', directo a la carpeta del pedido.');
      } else {
        paintHero('processing', f.name, 100, f.spec.check);
      }
    } else if (settled) {
      if (c.done === files.length) {
        paintHero('done', files.length + ' archivos guardados', 100,
          'Pedido completo. La prueba de color te llega hoy antes de las 6 p. m.');
      } else {
        var bad = files.filter(function (f) { return f.phase === 'error'; })[0];
        paintHero('error', 'Falta ' + bad.name, Math.round(bad.pct),
          'Se cortó al ' + Math.round(bad.pct) + '%. Los otros ' + c.done + ' ya están guardados: reintenta solo este.');
      }
    } else if (files.every(function (f) { return f.phase === 'queued'; })) {
      paintHero('queued', 'Preparando ' + files.length + ' archivos', 0, 'Suben uno por uno, en el orden de la lista.');
    }
  }

  /* ---------- clock ---------- */
  function setPhase(f, phase) {
    f.phase = phase;
    f.t = 0;
    paintRow(f, true);
  }

  function step() {
    if (gap > 0) { gap -= TICK; return; }

    if (!active) {
      active = queue.shift() || null;
      if (!active) { settle(); return; }
      active.pct = 0;
      setPhase(active, 'uploading');
      say('Subiendo ' + active.name);
    }

    var f = active;
    f.t += TICK;

    if (f.phase === 'uploading') {
      var dur = f.failed ? f.spec.up * 0.9 : f.spec.up;
      f.pct = Math.min(100, (f.t / dur) * 100);
      if (f.spec.failAt && !f.failed && f.pct >= f.spec.failAt) {
        f.pct = f.spec.failAt;
        f.failed = true;
        setPhase(f, 'error');
        say(f.name + ' no se subió: se cortó la conexión. Puedes reintentarlo.');
        paintHero('error', f.name, Math.round(f.pct), 'Se cortó la conexión al ' + Math.round(f.pct) + '%. Seguimos con el siguiente.');
        active = null;
        gap = GAP;
      } else if (f.pct >= 100) {
        f.pct = 100;
        setPhase(f, 'processing');
      } else {
        paintRow(f, false);
      }
    } else if (f.phase === 'processing' && f.t >= f.spec.proc) {
      setPhase(f, 'done');
      say(f.name + ' guardado.');
      paintHero('done', f.name, 100, 'Guardado en la carpeta del pedido.');
      active = null;
      gap = GAP;
    }
    paint();
  }

  function settle() {
    settled = true;
    stopClock();
    var c = counts();
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pausar';
    root.classList.remove('is-paused');
    say(c.done === files.length
      ? 'Pedido completo: ' + files.length + ' de ' + files.length + ' archivos subidos.'
      : c.done + ' de ' + files.length + ' subidos. Falta un archivo.');
    paint();
  }

  function running() { return !userPaused && visible && !document.hidden && !settled; }

  function startClock() { if (!timer) timer = setInterval(step, TICK); }
  function stopClock() { if (timer) { clearInterval(timer); timer = null; } }

  function sync() {
    if (running()) startClock(); else stopClock();
    root.classList.toggle('is-paused', !settled && !running());
  }

  /* ---------- controls ---------- */
  function reset() {
    stopClock();
    queue = files.slice();
    active = null;
    gap = 600;
    settled = false;
    userPaused = false;
    heroPhase = null;
    files.forEach(function (f) {
      f.pct = 0; f.t = 0; f.failed = false; f.phase = 'queued';
      paintRow(f, true);
    });
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pausar';
    paint();
    sync();
  }

  pauseBtn.addEventListener('click', function () {
    userPaused = !userPaused;
    pauseBtn.textContent = userPaused ? 'Reanudar' : 'Pausar';
    say(userPaused ? 'Subida en pausa.' : 'Subida reanudada.');
    sync();
  });

  restartBtn.addEventListener('click', reset);

  files.forEach(function (f) {
    f.retry.addEventListener('click', function () {
      f.pct = 0;
      setPhase(f, 'queued');
      f.state.textContent = 'En cola';
      queue.push(f);
      f.li.focus();
      say(f.name + ' vuelve a la cola.');
      if (settled) {
        settled = false;
        pauseBtn.disabled = false;
        gap = 300;
      }
      paint();
      sync();
    });
  });

  /* ---------- pause offscreen / hidden tab ---------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      sync();
    }).observe(root);
  }
  document.addEventListener('visibilitychange', sync);

  reset();
})();
