(() => {
  document.documentElement.classList.add("js");

  const panel = document.getElementById("cq-panel");
  if (!panel) return;

  const photos = [...panel.querySelectorAll(".cq-stage img")];
  const slides = [...panel.querySelectorAll(".cq-slide")];
  const thumbs = [...panel.querySelectorAll(".cq-thumb")];
  const pauseBtn = document.getElementById("cq-pause");
  const prevBtn = document.getElementById("cq-prev");
  const nextBtn = document.getElementById("cq-next");
  const nowEl = document.getElementById("cq-now");
  const slidesWrap = document.getElementById("cq-slides");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const N = slides.length;
  const DWELL = 8000;
  let index = 0;
  let elapsed = 0;
  let last = 0;
  let raf = 0;

  // Autoplay runs only when nothing holds it: user pause, hover, focus inside, offscreen, hidden tab.
  const holds = { user: reduce.matches, hover: false, focus: false, offscreen: true };

  function go(i, fromUser) {
    index = (i + N) % N;
    photos.forEach((p, k) => p.classList.toggle("is-on", k === index));
    slides.forEach((s, k) => {
      const on = k === index;
      s.classList.toggle("is-on", on);
      s.setAttribute("aria-hidden", String(!on));
    });
    thumbs.forEach((t, k) => {
      if (k === index) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
      t.style.setProperty("--p", "0");
    });
    nowEl.textContent = String(index + 1).padStart(2, "0");
    elapsed = 0;
    // Announce only user-driven changes.
    slidesWrap.setAttribute("aria-live", fromUser ? "polite" : "off");
    const t = thumbs[index];
    const row = t.parentElement;
    if (row.scrollWidth > row.clientWidth) {
      const left = t.offsetLeft - row.offsetLeft - 24;
      row.scrollTo({ left, behavior: reduce.matches ? "auto" : "smooth" });
    }
  }

  function running() {
    return !holds.user && !holds.hover && !holds.focus && !holds.offscreen && !document.hidden;
  }

  function loop(now) {
    raf = 0;
    if (!running()) return;
    elapsed += Math.min(100, now - last);
    last = now;
    thumbs[index].style.setProperty("--p", Math.min(1, elapsed / DWELL).toFixed(3));
    if (elapsed >= DWELL) go(index + 1, false);
    raf = requestAnimationFrame(loop);
  }

  function sync() {
    if (running() && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    const paused = holds.user;
    pauseBtn.classList.toggle("is-paused", paused);
    pauseBtn.setAttribute("aria-label", paused ? "Reanudar el carrusel" : "Pausar el carrusel");
  }

  pauseBtn.addEventListener("click", () => { holds.user = !holds.user; sync(); });
  prevBtn.addEventListener("click", () => go(index - 1, true));
  nextBtn.addEventListener("click", () => go(index + 1, true));

  thumbs.forEach((t, i) => {
    t.addEventListener("click", () => go(i, true));
    t.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = (i + 1) % N;
      else if (e.key === "ArrowLeft") next = (i - 1 + N) % N;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = N - 1;
      if (next === null) return;
      e.preventDefault();
      go(next, true);
      thumbs[next].focus();
    });
  });

  panel.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { holds.hover = true; sync(); } });
  panel.addEventListener("pointerleave", () => { holds.hover = false; sync(); });
  panel.addEventListener("focusin", () => { holds.focus = true; sync(); });
  panel.addEventListener("focusout", (e) => {
    if (!panel.contains(e.relatedTarget)) { holds.focus = false; sync(); }
  });

  new IntersectionObserver(([entry]) => {
    holds.offscreen = !entry.isIntersecting;
    sync();
  }, { threshold: 0.35 }).observe(panel);

  document.addEventListener("visibilitychange", sync);
  reduce.addEventListener?.("change", () => { if (reduce.matches) { holds.user = true; sync(); } });

  go(0, false);
  sync();
})();
