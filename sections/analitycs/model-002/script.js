(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fmt0 = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });
  var fmt1 = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  /* ---------- Data ---------- */
  var MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  var MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var MWH = [71.2, 64.8, 76.1, 83.4, 85.0, 80.3, 84.7, 91.2, 79.6, null, null, null];
  var BASE_KWH = 716300;          // enero → 27 de septiembre
  var SOLES_PER_KWH = 0.78;
  var T_PER_KWH = 0.00042;
  var PEAK_KW = 418;
  var SUNRISE = 6.05, SUNSET = 18.35;

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- Solar model ---------- */
  function forecast(h) {
    if (h <= SUNRISE || h >= SUNSET) return 0;
    var x = (h - SUNRISE) / (SUNSET - SUNRISE);
    return PEAK_KW * Math.pow(Math.sin(Math.PI * x), 1.35);
  }
  // Deterministic clouds: a few passing dips around midday
  function actual(h) {
    var f = forecast(h);
    var dip = 0.1 * Math.exp(-Math.pow((h - 11.2) / 0.35, 2)) +
              0.14 * Math.exp(-Math.pow((h - 14.6) / 0.5, 2)) +
              0.018 * Math.sin(h * 3.1);
    return Math.max(0, f * (1 - dip));
  }
  function energy(fn, from, to) {
    var sum = 0, step = 1 / 60;
    for (var h = from; h < to; h += step) sum += fn(h) * step;
    return sum;
  }

  function limaHour() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Lima", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = +p.value; });
    return (o.hour % 24) + o.minute / 60 + o.second / 3600;
  }

  /* ---------- Visibility / pause ---------- */
  var section = document.querySelector(".sillar");
  var onScreen = false;

  /* ---------- Counters ---------- */
  var kwhEl = document.getElementById("kwhTotal");
  var solesEl = document.getElementById("solesTotal");
  var co2El = document.getElementById("co2Total");
  var counted = false;
  var countProgress = 1;

  function liveTotal() {
    var h = limaHour();
    var today = energy(actual, SUNRISE, Math.min(h, SUNSET));
    return BASE_KWH + today;
  }

  function paintTotals(total) {
    var p = countProgress;
    kwhEl.textContent = fmt0.format(Math.floor(total * p));
    solesEl.textContent = fmt0.format(Math.floor(total * SOLES_PER_KWH * p));
    co2El.textContent = fmt0.format(Math.floor(total * T_PER_KWH * p));
  }

  function runCount() {
    if (counted) return;
    counted = true;
    if (reduce.matches) { countProgress = 1; paintTotals(liveTotal()); return; }
    var start = null, dur = 1800;
    countProgress = 0;
    function frame(t) {
      if (start === null) start = t;
      var x = Math.min(1, (t - start) / dur);
      countProgress = 1 - Math.pow(1 - x, 4);
      paintTotals(liveTotal());
      if (x < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Month columns ---------- */
  var monthCard = document.querySelector(".months");
  var monthChart = document.getElementById("monthChart");
  var monthSvg = monthChart.querySelector("svg");
  var tip = document.getElementById("monthTip");
  monthSvg.setAttribute("role", "group");
  monthSvg.setAttribute("aria-label", "Generación por mes, 2026. Usa Tab para recorrer los meses.");

  var tbody = document.getElementById("monthTable");
  MWH.forEach(function (v, i) {
    if (v === null) return;
    var tr = document.createElement("tr");
    tr.innerHTML = "<td>" + MONTH_NAMES[i] + (i === 8 ? " (al 27)" : "") + "</td><td>" + fmt1.format(v) + "</td>";
    tbody.appendChild(tr);
  });

  function colPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) + "V" + (y + r) +
      "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h) + "Z";
  }

  function drawMonths() {
    var W = monthChart.clientWidth, H = Math.max(220, monthSvg.clientHeight || 240);
    monthSvg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (monthSvg.firstChild) monthSvg.removeChild(monthSvg.firstChild);

    var padL = 34, padB = 26, padT = 22, plotW = W - padL, plotH = H - padB - padT;
    var max = 100;
    var y = function (v) { return padT + plotH - (v / max) * plotH; };

    [0, 25, 50, 75, 100].forEach(function (t) {
      el("line", { class: "grid-line", x1: padL, x2: W, y1: y(t), y2: y(t) }, monthSvg);
      var tx = el("text", { class: "axis-text", x: padL - 8, y: y(t) + 4, "text-anchor": "end" }, monthSvg);
      tx.textContent = t;
    });

    var slot = plotW / 12;
    var bw = Math.min(20, slot * 0.5);
    var compact = W < 420;
    var maxIdx = MWH.indexOf(Math.max.apply(null, MWH.filter(function (v) { return v !== null; })));

    MWH.forEach(function (v, i) {
      var cx = padL + slot * i + slot / 2;
      var lbl = el("text", {
        class: "axis-text" + (v === null ? " axis-text--muted" : ""),
        x: cx, y: H - 6, "text-anchor": "middle"
      }, monthSvg);
      lbl.textContent = compact ? MONTHS[i].charAt(0) : MONTHS[i];

      if (v === null) {
        el("rect", { class: "col-empty", x: cx - bw / 2, y: y(0) - 2, width: bw, height: 2, rx: 1 }, monthSvg);
        return;
      }
      var top = y(v), h = y(0) - top;
      var col = el("path", { class: "col", d: colPath(cx - bw / 2, top, bw, h, 4), style: "--i:" + i }, monthSvg);

      if (i === maxIdx) {
        var vl = el("text", { class: "value-label", x: cx, y: top - 8, "text-anchor": "middle" }, monthSvg);
        vl.textContent = fmt1.format(v);
      }

      var hit = el("rect", {
        class: "hit", x: padL + slot * i, y: padT, width: slot, height: plotH,
        tabindex: "0", role: "img",
        "aria-label": MONTH_NAMES[i] + (i === 8 ? " al día 27" : "") + ": " + fmt1.format(v) + " megavatios-hora"
      }, monthSvg);

      function show() {
        monthChart.classList.add("has-focus");
        col.classList.add("is-active");
        tip.innerHTML = MONTH_NAMES[i] + (i === 8 ? " (al 27)" : "") + "<br><strong>" + fmt1.format(v) + " MWh</strong>";
        tip.style.left = Math.min(Math.max(cx, 70), W - 70) + "px";
        tip.style.top = top + "px";
        tip.classList.add("is-visible");
      }
      function hide() {
        monthChart.classList.remove("has-focus");
        col.classList.remove("is-active");
        tip.classList.remove("is-visible");
      }
      hit.addEventListener("pointerenter", show);
      hit.addEventListener("pointerleave", hide);
      hit.addEventListener("focus", show);
      hit.addEventListener("blur", hide);
    });
  }

  /* ---------- Day curve ---------- */
  var daySvg = document.getElementById("dayChart");
  var dayDesc = document.getElementById("dayDesc");
  var kwNow = document.getElementById("kwNow");
  var kwLabel = document.getElementById("kwLabel");
  var todayTitle = document.getElementById("todayTitle");
  var todayTotal = document.getElementById("todayTotal");
  var todayCard = document.getElementById("today");

  function drawDay() {
    var box = daySvg.parentNode;
    var W = box.clientWidth, H = daySvg.clientHeight || 180;
    daySvg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (daySvg.firstChild) daySvg.removeChild(daySvg.firstChild);

    var h0 = 5, h1 = 19.5, padB = 22, padT = 10;
    var x = function (h) { return ((h - h0) / (h1 - h0)) * W; };
    var y = function (kw) { return padT + (H - padB - padT) * (1 - kw / 450); };

    [0, 200, 400].forEach(function (t) {
      el("line", { class: "grid-line", x1: 0, x2: W, y1: y(t), y2: y(t) }, daySvg);
      if (t) {
        var yl = el("text", { class: "axis-text", x: 0, y: y(t) - 6 }, daySvg);
        yl.textContent = t + " kW";
      }
    });
    [6, 9, 12, 15, 18].forEach(function (t) {
      var tx = el("text", { class: "axis-text", x: x(t), y: H - 4, "text-anchor": "middle" }, daySvg);
      tx.textContent = t + ":00";
    });

    var now = limaHour();
    var night = now < SUNRISE || now >= SUNSET;
    var end = night ? SUNSET : now;

    var fd = "", ad = "";
    for (var h = h0; h <= h1 + 0.001; h += 0.1) {
      fd += (fd ? "L" : "M") + x(h).toFixed(1) + "," + y(forecast(h)).toFixed(1);
    }
    for (var k = h0; k <= end + 0.001; k += 0.05) {
      ad += (ad ? "L" : "M") + x(k).toFixed(1) + "," + y(actual(k)).toFixed(1);
    }
    var endX = x(end), endY = y(actual(end));
    ad += "L" + endX.toFixed(1) + "," + endY.toFixed(1);

    el("path", { class: "forecast", d: fd }, daySvg);
    el("path", { class: "actual-area", d: ad + "L" + endX.toFixed(1) + "," + y(0) + "L" + x(h0) + "," + y(0) + "Z" }, daySvg);
    el("path", { class: "actual", d: ad }, daySvg);

    dayGeom = { x: x, y: y, W: W, H: H, h0: h0, h1: h1, end: end, padB: padB, padT: padT };
    var cross = el("g", { class: "cross" }, daySvg);
    el("line", { class: "cross-line", x1: 0, x2: 0, y1: padT, y2: H - padB }, cross);
    el("circle", { class: "cross-dot", cx: 0, cy: 0, r: 4 }, cross);
    crossG = cross;
    if (scrubH !== null) placeCross(scrubH);

    var kwhSoFar = energy(actual, SUNRISE, Math.min(now, SUNSET));
    var kwhForecast = energy(forecast, SUNRISE, SUNSET);

    if (!night) {
      el("circle", { class: "now-halo", cx: endX, cy: endY, r: 6 }, daySvg);
      el("circle", { class: "now-dot", cx: endX, cy: endY, r: 4 }, daySvg);
      todayTitle.textContent = "Hoy, potencia combinada";
      kwLabel.textContent = "ahora";
      todayTotal.innerHTML = "Generado hoy: <strong>" + fmt0.format(kwhSoFar) + " kWh</strong> de " + fmt0.format(kwhForecast) + " pronosticados";
      dayDesc.textContent = "Curva de potencia de hoy desde las 6:00 hasta ahora. Se generaron " + fmt0.format(kwhSoFar) + " kWh de " + fmt0.format(kwhForecast) + " pronosticados.";
    } else {
      todayTitle.textContent = now < SUNRISE ? "Ayer, potencia combinada" : "Hoy, día completo";
      kwLabel.textContent = "ahora, sin sol en Cayma";
      todayTotal.innerHTML = "Día completo: <strong>" + fmt0.format(energy(actual, SUNRISE, SUNSET)) + " kWh</strong> de " + fmt0.format(kwhForecast) + " pronosticados";
      dayDesc.textContent = "Curva de potencia del día completo, de 6:00 a 18:20. Total " + fmt0.format(energy(actual, SUNRISE, SUNSET)) + " kWh.";
    }
  }

  /* ---------- Crosshair scrub ---------- */
  var dayGeom = null, crossG = null, scrubH = null;
  var dayBox = daySvg.parentNode;
  var dayTip = document.getElementById("dayTip");
  var scrub = document.getElementById("dayScrub");

  function hhmm(h) {
    var m = Math.round(h * 60);
    return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
  }
  function placeCross(h) {
    if (!dayGeom || !crossG) return;
    h = Math.max(6, Math.min(dayGeom.end > 6 ? dayGeom.end : 18.25, h, 18.25));
    scrubH = h;
    var g = dayGeom, px = g.x(h), kw = actual(h), fk = forecast(h);
    crossG.querySelector(".cross-line").setAttribute("x1", px);
    crossG.querySelector(".cross-line").setAttribute("x2", px);
    var d = crossG.querySelector(".cross-dot");
    d.setAttribute("cx", px); d.setAttribute("cy", g.y(kw));
    crossG.classList.add("is-on");
    dayTip.innerHTML = "<strong>" + hhmm(h) + "</strong> · " + fmt0.format(kw) + " kW<br><span>pronóstico " + fmt0.format(fk) + " kW</span>";
    dayTip.style.left = Math.min(Math.max(px, 72), g.W - 72) + "px";
    dayTip.classList.add("is-visible");
    scrub.setAttribute("aria-valuenow", Math.round(h * 60));
    scrub.setAttribute("aria-valuetext", hhmm(h) + ", " + fmt0.format(kw) + " kilovatios; pronóstico " + fmt0.format(fk));
  }
  function hideCross() {
    if (crossG) crossG.classList.remove("is-on");
    dayTip.classList.remove("is-visible");
    scrubH = null;
  }
  function fromPointer(e) {
    if (!dayGeom) return;
    var r = dayBox.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width * dayGeom.W;
    placeCross(dayGeom.h0 + px / dayGeom.W * (dayGeom.h1 - dayGeom.h0));
  }
  scrub.addEventListener("pointermove", fromPointer);
  scrub.addEventListener("pointerdown", function (e) { fromPointer(e); });
  scrub.addEventListener("pointerleave", function () { if (document.activeElement !== scrub) hideCross(); });
  scrub.addEventListener("focus", function () { placeCross(scrubH !== null ? scrubH : 12); });
  scrub.addEventListener("blur", hideCross);
  scrub.addEventListener("keydown", function (e) {
    var step = { ArrowRight: 0.25, ArrowUp: 0.25, ArrowLeft: -0.25, ArrowDown: -0.25, PageUp: 1, PageDown: -1 }[e.key];
    var base = scrubH !== null ? scrubH : 12;
    if (step) { e.preventDefault(); placeCross(base + step); }
    else if (e.key === "Home") { e.preventDefault(); placeCross(6); }
    else if (e.key === "End") { e.preventDefault(); placeCross(18.25); }
  });

  function tickNow() {
    var h = limaHour();
    var kw = actual(h);
    if (kw > 0) kw *= 1 + 0.012 * Math.sin(Date.now() / 900);
    kwNow.textContent = fmt0.format(kw);
    if (counted && countProgress >= 1) paintTotals(liveTotal());
  }

  /* ---------- Loops ---------- */
  var tickTimer = null, curveTimer = null;
  function start() {
    if (tickTimer || document.hidden || !onScreen) return;
    tickNow();
    tickTimer = setInterval(tickNow, 1000);
    curveTimer = setInterval(drawDay, 30000);
    todayCard.classList.remove("is-paused");
  }
  function stop() {
    clearInterval(tickTimer); clearInterval(curveTimer);
    tickTimer = curveTimer = null;
    todayCard.classList.add("is-paused");
  }

  drawMonths();
  drawDay();
  if (!reduce.matches && "IntersectionObserver" in window) { countProgress = 0; paintTotals(BASE_KWH); }
  tickNow();

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        onScreen = e.isIntersecting;
        if (onScreen) start(); else stop();
      });
    }, { threshold: 0 }).observe(section);

    var story = document.querySelector(".grid");
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { runCount(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(story);

    var io2 = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { monthCard.classList.add("is-drawn"); io2.disconnect(); }
    }, { threshold: 0.25 });
    io2.observe(monthCard);
  } else {
    onScreen = true; counted = true; start(); monthCard.classList.add("is-drawn");
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var rT;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      var drawn = monthCard.classList.contains("is-drawn");
      drawMonths(); drawDay();
      if (drawn) monthCard.classList.add("is-drawn");
    }, 120);
  });
})();
