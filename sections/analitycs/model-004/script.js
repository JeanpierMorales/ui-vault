(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var NS = "http://www.w3.org/2000/svg";
  var fmt = new Intl.NumberFormat("es-PE");

  /* ---------- Model ---------- */
  var DISTRICTS = [
    // [corto, nombre completo, minutos base desde Surquillo, peso de volumen, sensibilidad a la hora punta]
    ["Surquillo", "Surquillo", 18, 0.7, 1],
    ["Miraflores", "Miraflores", 20, 1.4, 1],
    ["San Isidro", "San Isidro", 22, 1.2, 1.05],
    ["Barranco", "Barranco", 24, 0.8, 1],
    ["San Borja", "San Borja", 24, 0.9, 1.1],
    ["Lince", "Lince", 28, 0.6, 1],
    ["Surco", "Santiago de Surco", 30, 1.5, 1.35],
    ["Jesús María", "Jesús María", 32, 0.8, 1.05],
    ["La Molina", "La Molina", 40, 1.0, 1.35],
    ["San Miguel", "San Miguel", 42, 0.9, 1.1]
  ];
  var HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  var TRAFFIC = {
    week: [1.55, 1.45, 1.15, 1.05, 1.15, 1.2, 1.05, 0.95, 1.05, 1.4, 1.9, 1.7, 1.25],
    sat: [0.9, 0.95, 1.05, 1.2, 1.4, 1.4, 1.2, 1.1, 1.1, 1.15, 1.2, 1.1, 1.0]
  };
  var VOLUME = [0.6, 0.8, 1.1, 1.2, 1.1, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 0.9, 0.5];

  function noise(i, j, k) {
    var s = Math.sin(i * 12.9898 + j * 78.233 + k * 37.719) * 43758.5453;
    return s - Math.floor(s);
  }

  function minutes(day, di, hi) {
    var d = DISTRICTS[di], t = TRAFFIC[day][hi];
    var rush = 1 + (t - 1) * (t > 1 ? d[4] : 1);
    if (day === "sat" && (d[0] === "Surco" || d[0] === "La Molina") && hi >= 4 && hi <= 6) rush += 0.2;
    return Math.round(8 + d[2] * rush + (noise(di, hi, day === "sat" ? 2 : 1) - 0.5) * 6);
  }
  function shipments(day, di, hi) {
    var base = day === "sat" ? 95 : 480;
    return Math.round(base * DISTRICTS[di][3] * VOLUME[hi] * (0.9 + noise(hi, di, 5) * 0.2));
  }
  function onTime(m) { return Math.max(18, Math.min(99, Math.round(100 - Math.max(0, m - 38) * 1.05))); }
  function bin(m) {
    if (m < 30) return 1; if (m < 40) return 2; if (m < 50) return 3;
    if (m < 60) return 4; if (m < 75) return 5; return 6;
  }

  /* ---------- Build table ---------- */
  var table = document.getElementById("heat");
  var head = document.getElementById("heatHead");
  var body = document.getElementById("heatBody");
  var caption = document.getElementById("heatCaption");
  var tip = document.getElementById("tip");
  var wrap = table.parentNode;

  var hr = document.createElement("tr");
  var corner = document.createElement("th");
  corner.scope = "col";
  corner.innerHTML = '<span class="sr-only">Distrito</span>';
  hr.appendChild(corner);
  HOURS.forEach(function (h, i) {
    var th = document.createElement("th");
    th.scope = "col";
    th.textContent = h;
    th.setAttribute("aria-label", h + ":00");
    if (i % 2) th.className = "odd";
    hr.appendChild(th);
  });
  head.appendChild(hr);

  var cells = [];
  DISTRICTS.forEach(function (d, di) {
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.scope = "row";
    th.textContent = d[0];
    th.title = d[1];
    tr.appendChild(th);
    cells[di] = [];
    HOURS.forEach(function (h, hi) {
      var td = document.createElement("td");
      td.className = "cell";
      td.tabIndex = -1;
      td.dataset.d = di;
      td.dataset.h = hi;
      td.style.setProperty("--d", hi * 22 + "ms");
      td.innerHTML = '<span class="v"></span>';
      tr.appendChild(td);
      cells[di][hi] = td;
    });
    body.appendChild(tr);
  });

  /* ---------- State ---------- */
  var day = "week";
  var sel = { d: 6, h: 10 };   // Surco, 18:00

  function paint() {
    DISTRICTS.forEach(function (d, di) {
      HOURS.forEach(function (h, hi) {
        var m = minutes(day, di, hi);
        var td = cells[di][hi];
        td.style.setProperty("--c", "var(--r" + bin(m) + ")");
        td.firstChild.textContent = m + " min";
      });
    });
    caption.textContent = "Minutos promedio de entrega por distrito y hora de recojo, " +
      (day === "week" ? "lunes a viernes" : "sábados") + ". Usa las flechas para moverte entre celdas.";
    select(sel.d, sel.h, false);
  }

  var dDistrict = document.getElementById("dDistrict");
  var dHour = document.getElementById("dHour");
  var dMin = document.getElementById("dMin");
  var dCount = document.getElementById("dCount");
  var dOnTime = document.getElementById("dOnTime");
  var miniCap = document.getElementById("miniCap");
  var best = document.getElementById("best");
  var mini = document.getElementById("mini");

  function select(di, hi, focus) {
    var prev = cells[sel.d][sel.h];
    prev.classList.remove("is-selected");
    prev.tabIndex = -1;
    body.querySelectorAll("tr.is-row").forEach(function (r) { r.classList.remove("is-row"); });

    sel = { d: di, h: hi };
    var td = cells[di][hi];
    td.classList.add("is-selected");
    td.tabIndex = 0;
    td.parentNode.classList.add("is-row");
    if (focus) td.focus();

    var d = DISTRICTS[di], m = minutes(day, di, hi);
    dDistrict.textContent = d[1];
    dHour.textContent = HOURS[hi] + ":00";
    dMin.textContent = m;
    dCount.textContent = fmt.format(shipments(day, di, hi));
    dOnTime.textContent = onTime(m) + " %";
    miniCap.textContent = d[0] + ", hora por hora" + (day === "sat" ? " (sábado)" : "");

    var row = HOURS.map(function (_, k) { return minutes(day, di, k); });
    var bi = row.indexOf(Math.min.apply(null, row));
    best.innerHTML = "Mejor hora para enviar a " + d[0] + ": <strong>" + HOURS[bi] + ":00</strong>, " + row[bi] + " min.";
    drawMini(row, hi);
  }

  function colPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) + "V" + (y + h) + "Z";
  }

  function drawMini(row, hi) {
    var W = mini.clientWidth || 260, H = 84, padB = 16;
    mini.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (mini.firstChild) mini.removeChild(mini.firstChild);
    var slot = W / row.length, bw = Math.min(14, slot - 4);
    row.forEach(function (m, k) {
      var h = (m / 100) * (H - padB - 4);
      var x = k * slot + (slot - bw) / 2;
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", colPath(x, H - padB - h, bw, h, 3));
      p.setAttribute("class", "mini-bar" + (k === hi ? " is-on" : ""));
      mini.appendChild(p);
      if (k % 4 === 0) {
        var t = document.createElementNS(NS, "text");
        t.setAttribute("class", "mini-axis");
        t.setAttribute("x", k * slot + slot / 2);
        t.setAttribute("y", H - 2);
        t.setAttribute("text-anchor", "middle");
        t.textContent = HOURS[k] + ":00";
        mini.appendChild(t);
      }
    });
  }

  /* ---------- Tooltip ---------- */
  function showTip(td) {
    var di = +td.dataset.d, hi = +td.dataset.h, m = minutes(day, di, hi);
    tip.innerHTML = DISTRICTS[di][0] + ", " + HOURS[hi] + ":00<br><strong>" + m + " min</strong> · " + fmt.format(shipments(day, di, hi)) + " envíos";
    var wr = wrap.getBoundingClientRect(), r = td.getBoundingClientRect();
    var x = r.left - wr.left + r.width / 2;
    var half = 90;
    tip.style.left = Math.max(half, Math.min(wr.width - half, x)) + "px";
    tip.style.top = (r.top - wr.top) + "px";
    tip.classList.add("is-visible");
  }
  function hideTip() { tip.classList.remove("is-visible"); }

  body.addEventListener("pointerover", function (e) {
    var td = e.target.closest(".cell");
    if (td && e.pointerType === "mouse") showTip(td);
  });
  body.addEventListener("pointerleave", hideTip);
  body.addEventListener("click", function (e) {
    var td = e.target.closest(".cell");
    if (!td) return;
    select(+td.dataset.d, +td.dataset.h, true);
    showTip(td);
  });
  body.addEventListener("focusin", function (e) {
    var td = e.target.closest(".cell");
    if (td) showTip(td);
  });
  body.addEventListener("focusout", hideTip);

  body.addEventListener("keydown", function (e) {
    var td = e.target.closest(".cell");
    if (!td) return;
    var di = +td.dataset.d, hi = +td.dataset.h;
    var nd = di, nh = hi;
    switch (e.key) {
      case "ArrowRight": nh = Math.min(HOURS.length - 1, hi + 1); break;
      case "ArrowLeft": nh = Math.max(0, hi - 1); break;
      case "ArrowDown": nd = Math.min(DISTRICTS.length - 1, di + 1); break;
      case "ArrowUp": nd = Math.max(0, di - 1); break;
      case "Home": nh = 0; break;
      case "End": nh = HOURS.length - 1; break;
      default: return;
    }
    e.preventDefault();
    select(nd, nh, true);
  });

  /* ---------- Day toggle ---------- */
  var segs = document.querySelectorAll(".seg");
  segs.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.day === day) return;
      day = b.dataset.day;
      segs.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      paint();
    });
  });

  paint();

  var rT;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () { select(sel.d, sel.h, false); }, 120);
  });
})();
