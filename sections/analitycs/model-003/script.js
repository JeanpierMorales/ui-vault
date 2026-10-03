(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Data (minuto, % que sigue escuchando) ---------- */
  var DURATION = 58 + 20 / 60;
  var EP = [[0, 100], [1, 94], [3, 89.5], [4, 88.6], [10, 86.4], [17.5, 85], [19, 85.6], [25, 83.4], [33, 80.2], [34.2, 76.1], [36, 75.6], [41, 75], [45, 73.9], [52, 71.8], [55, 70.4], [DURATION, 68]];
  var AVG = [[0, 100], [1, 84], [3, 72], [5, 66], [10, 58], [18, 52], [25, 48], [33, 45], [34.2, 42], [41, 39.5], [45, 37.8], [52, 35.2], [DURATION, 33]];
  var CHAPTERS = [
    [0, "Intro", "Intro y cabecera"],
    [4, "La bodega", "La bodega de don Manuel"],
    [18, "Llega Rosa", "Llega Rosa Chumpitaz"],
    [33, "Pausa", "Pausa publicitaria"],
    [36, "La receta", "La receta del pan con chicharrón"],
    [52, "Cierre", "Cierre y correo de oyentes"]
  ];
  var START_MIN = 35;

  /* Monotone cubic (Fritsch–Carlson) */
  function monotone(pts) {
    var n = pts.length, dx = [], dy = [], m = [], t = [];
    for (var i = 0; i < n - 1; i++) {
      dx[i] = pts[i + 1][0] - pts[i][0];
      dy[i] = pts[i + 1][1] - pts[i][1];
      m[i] = dy[i] / dx[i];
    }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
      var a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
      if (s > 9) { var k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
    return function (x) {
      var j = 0;
      while (j < n - 2 && x > pts[j + 1][0]) j++;
      var h = dx[j], u = (x - pts[j][0]) / h, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * pts[j][1] + (u3 - 2 * u2 + u) * h * t[j] +
             (-2 * u3 + 3 * u2) * pts[j + 1][1] + (u3 - u2) * h * t[j + 1];
    };
  }
  var ep = monotone(EP), avg = monotone(AVG);

  function chapterAt(min) {
    var c = CHAPTERS[0];
    for (var i = 0; i < CHAPTERS.length; i++) if (min >= CHAPTERS[i][0]) c = CHAPTERS[i];
    return c;
  }
  function mmss(min) {
    var s = Math.round(min * 60);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
  function pct(v) { return Math.round(v) + " %"; }

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- Table ---------- */
  var tbody = document.getElementById("table");
  [0, 1, 3, 5, 10, 15, 18, 20, 25, 30, 33, 35, 40, 45, 50, 52, 55, 58].forEach(function (m) {
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + m + "</td><td>" + chapterAt(m)[2] + "</td><td>" + pct(ep(m)) + "</td><td>" + pct(avg(m)) + "</td>";
    tbody.appendChild(tr);
  });

  /* ---------- Chart ---------- */
  var chart = document.getElementById("chart");
  var svg = document.getElementById("svg");
  var scrub = document.getElementById("scrub");
  var roTime = document.getElementById("roTime");
  var roChapter = document.getElementById("roChapter");
  var roEp = document.getElementById("roEp");
  var roAvg = document.getElementById("roAvg");

  var geo = null, cursor = {}, chapterEls = [];
  var current = START_MIN;

  function draw() {
    var W = chart.clientWidth, H = chart.clientHeight;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    chapterEls = [];

    var narrow = W < 520;
    var padL = 40, padR = narrow ? 8 : 48, padT = 12;
    var stripH = 6;
    var bottom = H - (narrow ? 44 : 58);
    var x = function (m) { return padL + (m / DURATION) * (W - padL - padR); };
    var y = function (v) { return padT + (1 - v / 100) * (bottom - padT); };
    geo = { x: x, y: y, W: W, padL: padL, padR: padR, bottom: bottom, padT: padT };

    [0, 25, 50, 75, 100].forEach(function (t) {
      el("line", { class: "grid-line", x1: padL, x2: W - padR, y1: y(t), y2: y(t) }, svg);
      el("text", { class: "axis-text", x: padL - 8, y: y(t) + 4, "text-anchor": "end" }, svg).textContent = t + (t === 100 ? "" : "");
    });
    el("text", { class: "axis-text", x: padL - 8, y: padT - 0, "text-anchor": "end", dy: "-8" }, svg).textContent = "%";

    var ticks = narrow ? [0, 20, 40] : [0, 10, 20, 30, 40, 50];
    ticks.forEach(function (m) {
      el("text", { class: "axis-text", x: x(m), y: bottom + 18, "text-anchor": m === 0 ? "start" : "middle" }, svg).textContent = m + (m === 0 ? " min" : "");
    });

    // chapter strip with 2px surface gaps
    var stripY = bottom + 28;
    CHAPTERS.forEach(function (c, i) {
      var x0 = x(c[0]) + (i ? 1 : 0);
      var x1 = x(i < CHAPTERS.length - 1 ? CHAPTERS[i + 1][0] : DURATION) - (i < CHAPTERS.length - 1 ? 1 : 0);
      var r = el("rect", { class: "chapter", x: x0, y: stripY, width: Math.max(1, x1 - x0), height: stripH, rx: 2 }, svg);
      var lbl = null;
      if (!narrow && (x1 - x0) > c[1].length * 6.6 + 8) {
        lbl = el("text", { class: "chapter-label", x: x0, y: stripY + 22 }, svg);
        lbl.textContent = c[1];
      }
      chapterEls.push([r, lbl]);
    });

    // series paths
    var dEp = "", dAvg = "";
    for (var m = 0; m <= DURATION + 0.0001; m += DURATION / 240) {
      dEp += (dEp ? "L" : "M") + x(m).toFixed(1) + "," + y(ep(m)).toFixed(1);
      dAvg += (dAvg ? "L" : "M") + x(m).toFixed(1) + "," + y(avg(m)).toFixed(1);
    }
    // wash only between the two curves: the lead over the average
    var back = "";
    for (var q = DURATION; q >= -0.0001; q -= DURATION / 240) back += "L" + x(Math.max(0, q)).toFixed(1) + "," + y(avg(Math.max(0, q))).toFixed(1);
    el("path", { class: "area--ep", d: dEp + back + "Z" }, svg);
    var pa = el("path", { class: "line line--avg", d: dAvg }, svg);
    var pe = el("path", { class: "line line--ep", d: dEp }, svg);
    [pa, pe].forEach(function (p) { p.style.setProperty("--len", Math.ceil(p.getTotalLength())); });

    if (!narrow) {
      el("text", { class: "end-label", x: W - padR + 8, y: y(ep(DURATION)) + 4 }, svg).textContent = pct(ep(DURATION));
      el("text", { class: "end-label end-label--muted", x: W - padR + 8, y: y(avg(DURATION)) + 4 }, svg).textContent = pct(avg(DURATION));
    }

    var g = el("g", { class: "cursor" }, svg);
    cursor.line = el("line", { class: "cursor-line", y1: padT, y2: bottom }, g);
    cursor.avg = el("circle", { class: "cursor-dot cursor-dot--avg", r: 5 }, g);
    cursor.ep = el("circle", { class: "cursor-dot cursor-dot--ep", r: 5 }, g);

    setMinute(current, true);
  }

  function setMinute(min, silent) {
    min = Math.max(0, Math.min(DURATION, min));
    current = min;
    if (!geo) return;
    var px = geo.x(min), e = ep(min), a = avg(min), c = chapterAt(min);
    cursor.line.setAttribute("x1", px); cursor.line.setAttribute("x2", px);
    cursor.ep.setAttribute("cx", px); cursor.ep.setAttribute("cy", geo.y(e));
    cursor.avg.setAttribute("cx", px); cursor.avg.setAttribute("cy", geo.y(a));

    chapterEls.forEach(function (pair, i) {
      var on = CHAPTERS[i] === c;
      pair[0].classList.toggle("is-current", on);
      if (pair[1]) pair[1].classList.toggle("is-current", on);
    });

    roTime.textContent = mmss(min);
    roChapter.textContent = c[2];
    roEp.textContent = pct(e);
    roAvg.textContent = pct(a);

    scrub.setAttribute("aria-valuenow", Math.round(min * 60));
    scrub.setAttribute("aria-valuetext", "Minuto " + mmss(min) + ", " + c[2] + ". " + pct(e) + " sigue escuchando el episodio 112; " + pct(a) + " en el promedio.");
  }

  /* ---------- Scrub: pointer + keyboard ---------- */
  var dragging = false;
  function fromEvent(e) {
    var r = chart.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width * geo.W;
    setMinute((px - geo.padL) / (geo.W - geo.padL - geo.padR) * DURATION);
  }
  scrub.addEventListener("pointerdown", function (e) {
    cancelIntro();
    dragging = true;
    if (e.pointerType === "mouse") scrub.setPointerCapture(e.pointerId);
    fromEvent(e);
  });
  scrub.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse" || dragging) { cancelIntro(); fromEvent(e); }
  });
  ["pointerup", "pointercancel"].forEach(function (t) {
    scrub.addEventListener(t, function () { dragging = false; });
  });
  scrub.addEventListener("keydown", function (e) {
    var map = { ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5, PageUp: 5, PageDown: -5 };
    if (map[e.key] !== undefined) { e.preventDefault(); cancelIntro(); setMinute(current + map[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); cancelIntro(); setMinute(0); }
    else if (e.key === "End") { e.preventDefault(); cancelIntro(); setMinute(DURATION); }
  });

  /* ---------- Intro: the curve draws and the cursor glides to the ad break ---------- */
  var introRaf = null;
  function cancelIntro() { if (introRaf) { cancelAnimationFrame(introRaf); introRaf = null; } }
  function intro() {
    chart.classList.add("is-drawn");
    if (reduce.matches) { setMinute(START_MIN); return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      setMinute(START_MIN * e);
      introRaf = k < 1 ? requestAnimationFrame(step) : null;
    }
    introRaf = requestAnimationFrame(step);
  }

  draw();

  if ("IntersectionObserver" in window && !reduce.matches) {
    setMinute(0);
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { intro(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(chart);
  } else {
    chart.classList.add("is-drawn");
  }

  var rT;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(draw, 120);
  });
})();
