(() => {
  document.documentElement.classList.add("js");

  const top = document.getElementById("top");
  const hero = document.querySelector(".hero");
  const menuBtn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeBtn");
  const links = [...document.querySelectorAll("#bigList a")];
  const previewImg = document.getElementById("previewImg");
  const previewCap = document.getElementById("previewCap");
  const clock = document.getElementById("clock");
  const liveStatus = document.getElementById("liveStatus");
  const nextVisit = document.getElementById("nextVisit");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  links.forEach((a, i) => a.querySelector(".word").style.setProperty("--i", i));

  /* ---------- bar turns solid once the photo is behind it ---------- */

  let ticking = false;
  function onScroll() {
    ticking = false;
    top.classList.toggle("is-solid", hero.getBoundingClientRect().bottom <= top.offsetHeight + 8);
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- live detail: Arequipa time, studio hours, next open visit ---------- */

  const TZ = "America/Lima"; // Arequipa comparte hora con Lima
  const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const OPEN = 9 * 60, CLOSE = 19 * 60;
  const VISIT = 18 * 60 + 30, VISIT_END = 21 * 60;

  function arequipaNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hour12: false, year: "numeric", month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric", weekday: "short",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return {
      y: +get("year"), mo: +get("month"), d: +get("day"),
      h: +get("hour") % 24, m: +get("minute"),
      wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
    };
  }

  const pad = (n) => String(n).padStart(2, "0");

  function renderLive() {
    const t = arequipaNow();
    const mins = t.h * 60 + t.m;
    clock.textContent = `${pad(t.h)}:${pad(t.m)}`;

    const weekday = t.wd >= 1 && t.wd <= 5;
    if (weekday && mins >= OPEN && mins < CLOSE) {
      const left = CLOSE - mins;
      liveStatus.textContent = left <= 60
        ? `Taller abierto, cerramos en ${left} min.`
        : "Taller abierto ahora, hasta las 19:00.";
    } else if (weekday && mins < OPEN) {
      liveStatus.textContent = "Taller cerrado. Abrimos hoy a las 9:00.";
    } else {
      const reopen = t.wd === 5 || t.wd === 6 ? "el lunes" : "mañana";
      liveStatus.textContent = `Taller cerrado. Abrimos ${reopen} a las 9:00.`;
    }

    if (t.wd === 4 && mins >= VISIT && mins < VISIT_END) {
      nextVisit.textContent = "Visita abierta en curso, hasta las 21:00.";
      return;
    }
    let add = (4 - t.wd + 7) % 7;
    if (add === 0 && mins >= VISIT) add = 7;
    const date = new Date(Date.UTC(t.y, t.mo - 1, t.d + add));
    const label = add === 0 ? "hoy" : add === 1 ? "mañana" : DAYS[date.getUTCDay()];
    nextVisit.textContent = `Visita abierta: ${label} ${date.getUTCDate()} de ${MONTHS[date.getUTCMonth()]}, 18:30`;
  }

  let timer = null;
  function startLive() {
    renderLive();
    clearInterval(timer);
    timer = setInterval(() => { if (!document.hidden) renderLive(); }, 15000);
  }
  function stopLive() { clearInterval(timer); timer = null; }

  /* ---------- preview swap ---------- */

  let currentImg = previewImg.getAttribute("src");
  let swapTimer = null;
  function preview(a) {
    previewCap.textContent = a.dataset.cap;
    const src = a.dataset.img;
    if (src === currentImg) return;
    currentImg = src;
    clearTimeout(swapTimer);
    if (reduce.matches) { previewImg.src = src; return; }
    previewImg.classList.add("is-swapping");
    swapTimer = setTimeout(() => {
      previewImg.src = src;
      previewImg.classList.remove("is-swapping");
    }, 170);
  }
  links.forEach((a) => {
    a.addEventListener("pointerenter", () => preview(a));
    a.addEventListener("focus", () => preview(a));
  });
  links.forEach((a) => { const im = new Image(); im.src = a.dataset.img; });

  /* ---------- open / close ---------- */

  let closeTimer = null;

  function open() {
    clearTimeout(closeTimer);
    overlay.hidden = false;
    document.body.classList.add("is-locked");
    menuBtn.setAttribute("aria-expanded", "true");
    startLive();
    preview(links[0]);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("is-open")));
    links[0].focus({ preventScroll: true });
  }

  function close({ restoreFocus = true } = {}) {
    overlay.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    stopLive();
    closeTimer = setTimeout(() => { overlay.hidden = true; }, reduce.matches ? 200 : 640);
    if (restoreFocus) menuBtn.focus();
  }

  menuBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", () => close());
  links.forEach((a) => a.addEventListener("click", () => close({ restoreFocus: false })));

  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }

    const i = links.indexOf(document.activeElement);
    if (i !== -1 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      links[(i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length].focus();
      return;
    }

    if (e.key === "Tab") {
      const f = [...overlay.querySelectorAll("a[href], button")].filter((el) => el.offsetParent !== null);
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !overlay.hidden) renderLive();
  });
})();
