(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var usd = function (v) { return v.toFixed(2); };

  /* ---------- Data: US$ por libra ---------- */
  var DATA = {
    year: {
      labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
      long: ["2021", "2022", "2023", "2024", "2025", "2026 (a septiembre)"],
      finca: [2.48, 2.86, 2.58, 3.30, 4.52, 4.36],
      ny: [1.72, 2.13, 1.71, 2.46, 3.62, 3.34],
      title: "Precio por libra de café pergamino, 2021–2026",
      premiumLabel: "Prima promedio sobre la bolsa, 2021–2026",
      text: "Fijamos el precio el día de entrega en el acopio de Jaén: bolsa del día más la prima por calidad de taza. La prima nunca bajó de US$ 0.70, ni en 2023, cuando Nueva York cayó 20 %.",
      period: "Año",
      caption: "Dólares por libra, por año"
    },
    month: {
      labels: ["Abr", "May", "Jun", "Jul", "Ago", "Sep"],
      long: ["Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
      finca: [4.86, 4.70, 4.49, 4.31, 4.24, 4.27],
      ny: [3.86, 3.64, 3.41, 3.19, 3.06, 3.12],
      title: "Precio por libra, cosecha 2026 mes a mes",
      premiumLabel: "Prima promedio sobre la bolsa, cosecha 2026",
      text: "En la cosecha 2026 la bolsa bajó 21 % entre abril y agosto. La prima subió: los lotes de San Ignacio sobre 1,800 m pasaron de 86 puntos y se pagaron aparte.",
      period: "Mes",
      caption: "Dólares por libra, cosecha 2026 por mes"
    }
  };
  var MAX = 5;

  function avgPremium(d) {
    var s = 0;
    d.finca.forEach(function (f, i) { s += f - d.ny[i]; });
    return s / d.finca.length;
  }

  /* ---------- Elements ---------- */
  var chart = document.getElementById("chart");
  var svg = document.getElementById("svg");
  var tip = document.getElementById("tip");
  var title = document.getElementById("chartTitle");
  var premiumEl = document.getElementById("premium");
  var premiumLabel = document.getElementById("premiumLabel");
  var sideText = document.getElementById("sideText");
  var tbody = document.getElementById("table");
  var thPeriod = document.getElementById("thPeriod");
  var tableCap = document.getElementById("tableCap");

  var mode = "year";
  var shown = { finca: DATA.year.finca.slice(), ny: DATA.year.ny.slice() };
  var premiumShown = avgPremium(DATA.year);
  var geo = null, bars = [], labels = [], valueLabel = null, hits = [], bands = [];

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function colPath(x, y, w, h, r) {
    if (h <= 0) return "M" + x + "," + (y + h) + "h" + w;
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + "V" + (y + h) + "Z";
  }

  function draw() {
    var W = chart.clientWidth, H = chart.clientHeight;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    bars = []; labels = []; hits = []; bands = [];

    var padL = 40, padB = 28, padT = 20;
    var plotW = W - padL, plotH = H - padB - padT;
    var y = function (v) { return padT + plotH * (1 - v / MAX); };
    var slot = plotW / 6;
    var bw = Math.min(24, (slot - 16) / 2);
    geo = { y: y, slot: slot, bw: bw, padL: padL, plotH: plotH, padT: padT, W: W };

    [0, 1, 2, 3, 4, 5].forEach(function (t) {
      el("line", { class: "grid-line", x1: padL, x2: W, y1: y(t), y2: y(t) }, svg);
      el("text", { class: "axis-text", x: padL - 10, y: y(t) + 4, "text-anchor": "end" }, svg).textContent = t === 0 ? "0" : "$" + t;
    });

    for (var i = 0; i < 6; i++) {
      var cx = padL + slot * i + slot / 2;
      bands.push(el("rect", { class: "group-band", x: padL + slot * i + 2, y: padT, width: slot - 4, height: plotH, rx: 8 }, svg));
      var bf = el("path", { class: "bar-finca" }, svg);
      var bn = el("path", { class: "bar-ny" }, svg);
      bars.push([bf, bn, cx]);
      labels.push(el("text", { class: "axis-text", x: cx, y: H - 8, "text-anchor": "middle" }, svg));
    }
    valueLabel = el("text", { class: "bar-label", "text-anchor": "middle" }, svg);

    for (var j = 0; j < 6; j++) {
      var h = el("rect", { class: "group-hit", x: padL + slot * j, y: padT, width: slot, height: plotH, rx: 8, tabindex: "0", role: "img" }, svg);
      h.dataset.i = j;
      hits.push(h);
    }
    render();
  }

  function render() {
    if (!geo) return;
    var d = DATA[mode], y = geo.y, bw = geo.bw, gap = 2;
    bars.forEach(function (b, i) {
      var f = shown.finca[i], n = shown.ny[i];
      // adjacent bars separated by a 2px surface gap
      b[0].setAttribute("d", colPath(b[2] - bw - gap / 2, y(f), bw, y(0) - y(f), 4));
      b[1].setAttribute("d", colPath(b[2] + gap / 2, y(n), bw, y(0) - y(n), 4));
      labels[i].textContent = d.labels[i];
      hits[i].setAttribute("aria-label", d.long[i] + ": finca US$ " + usd(d.finca[i]) + ", Nueva York US$ " + usd(d.ny[i]) + ", prima US$ " + usd(d.finca[i] - d.ny[i]) + " por libra");
    });
    // direct label only on the latest period's finca bar
    var last = bars[5];
    valueLabel.setAttribute("x", last[2] - bw / 2 - 1);
    valueLabel.setAttribute("y", y(shown.finca[5]) - 8);
    valueLabel.textContent = "$" + usd(shown.finca[5]);
    premiumEl.textContent = usd(premiumShown);
  }

  function fillTable() {
    var d = DATA[mode];
    tbody.innerHTML = "";
    d.long.forEach(function (l, i) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + l + "</td><td>" + usd(d.finca[i]) + "</td><td>" + usd(d.ny[i]) + "</td><td>+" + usd(d.finca[i] - d.ny[i]) + "</td>";
      tbody.appendChild(tr);
    });
    thPeriod.textContent = d.period;
    tableCap.textContent = d.caption;
  }

  /* ---------- Toggle with tweened transition ---------- */
  var raf = null;
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    var d = DATA[m];
    title.textContent = d.title;
    premiumLabel.textContent = d.premiumLabel;
    sideText.textContent = d.text;
    fillTable();
    hideTip();

    var from = { finca: shown.finca.slice(), ny: shown.ny.slice(), p: premiumShown };
    var to = { finca: d.finca, ny: d.ny, p: avgPremium(d) };
    if (raf) cancelAnimationFrame(raf);

    if (reduce.matches) {
      shown = { finca: to.finca.slice(), ny: to.ny.slice() };
      premiumShown = to.p; render(); return;
    }
    var t0 = null, dur = 700;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 4);
      for (var i = 0; i < 6; i++) {
        // slight stagger across groups
        var ki = Math.min(1, Math.max(0, (k * dur - i * 40) / (dur - 200)));
        var ei = 1 - Math.pow(1 - ki, 4);
        shown.finca[i] = from.finca[i] + (to.finca[i] - from.finca[i]) * ei;
        shown.ny[i] = from.ny[i] + (to.ny[i] - from.ny[i]) * ei;
      }
      premiumShown = from.p + (to.p - from.p) * e;
      render();
      raf = k < 1 ? requestAnimationFrame(step) : null;
    }
    raf = requestAnimationFrame(step);
  }

  var tgs = document.querySelectorAll(".tg");
  tgs.forEach(function (b) {
    b.addEventListener("click", function () {
      tgs.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      setMode(b.dataset.mode);
    });
  });

  /* ---------- Tooltip ---------- */
  function showTip(i) {
    var d = DATA[mode];
    bands.forEach(function (b, k) { b.classList.toggle("is-on", k === i); });
    tip.innerHTML = "<strong>" + d.long[i] + "</strong><br>Finca US$ " + usd(d.finca[i]) + " · Nueva York US$ " + usd(d.ny[i]) + "<br>Prima <strong>+US$ " + usd(d.finca[i] - d.ny[i]) + "</strong>";
    var cx = bars[i][2];
    var top = geo.y(Math.max(d.finca[i], d.ny[i]));
    tip.style.left = Math.max(120, Math.min(geo.W - 120, cx)) + "px";
    tip.style.top = top + "px";
    tip.classList.add("is-visible");
  }
  function hideTip() {
    bands.forEach(function (b) { b.classList.remove("is-on"); });
    tip.classList.remove("is-visible");
  }
  svg.addEventListener("pointerover", function (e) {
    var h = e.target.closest(".group-hit");
    if (h) showTip(+h.dataset.i);
  });
  svg.addEventListener("pointerleave", hideTip);
  svg.addEventListener("focusin", function (e) {
    var h = e.target.closest(".group-hit");
    if (h) showTip(+h.dataset.i);
  });
  svg.addEventListener("focusout", hideTip);

  fillTable();
  draw();

  var rT;
  window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(draw, 120); });
})();
