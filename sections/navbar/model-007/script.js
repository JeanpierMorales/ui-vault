(() => {
  document.documentElement.classList.add("js");

  const head = document.getElementById("head");
  const menuBtn = document.getElementById("menuBtn");
  const navList = document.getElementById("navList");
  const tocBtn = document.getElementById("tocBtn");
  const toc = document.getElementById("toc");
  const tocLinks = [...toc.querySelectorAll("a")];
  const runTitle = document.getElementById("runTitle");
  const runChapter = document.getElementById("runChapter");
  const runLeft = document.getElementById("runLeft");
  const progressFill = document.getElementById("progressFill");
  const chapters = [...document.querySelectorAll(".chapter")];
  const essay = document.getElementById("essay");
  const mqMobile = window.matchMedia("(max-width: 960px)");

  const WPM = 180;
  const narrow = window.matchMedia("(max-width: 520px)");
  const words = chapters.map((c) => c.textContent.trim().split(/\s+/).length);
  const totalWords = words.reduce((a, b) => a + b, 0);

  /* ---------- menus ---------- */

  function setMenu(open, { focusBack = false } = {}) {
    menuBtn.setAttribute("aria-expanded", String(open));
    navList.classList.toggle("is-open", open);
    if (open) setToc(false);
    if (!open && focusBack) menuBtn.focus();
  }

  function setToc(open, { focusBack = false, focusFirst = false } = {}) {
    tocBtn.setAttribute("aria-expanded", String(open));
    toc.hidden = !open;
    if (open) {
      setMenu(false);
      showHead();
      if (focusFirst) tocLinks[0].focus();
    }
    if (!open && focusBack) tocBtn.focus();
  }

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  tocBtn.addEventListener("click", () => {
    setToc(toc.hidden);
  });

  tocBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setToc(true, { focusFirst: true });
    }
  });

  toc.addEventListener("keydown", (e) => {
    const i = tocLinks.indexOf(document.activeElement);
    if (i === -1) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowDown" ? 1 : -1) + tocLinks.length) % tocLinks.length;
      tocLinks[next].focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      tocLinks[e.key === "Home" ? 0 : tocLinks.length - 1].focus();
    }
  });

  tocLinks.forEach((a) => a.addEventListener("click", () => setToc(false)));
  navList.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!toc.hidden) setToc(false, { focusBack: true });
    else if (navList.classList.contains("is-open")) setMenu(false, { focusBack: true });
  });

  document.addEventListener("pointerdown", (e) => {
    if (!toc.hidden && !toc.contains(e.target) && !tocBtn.contains(e.target)) setToc(false);
    if (navList.classList.contains("is-open") && !navList.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  head.addEventListener("focusout", (e) => {
    if (!head.contains(e.relatedTarget)) {
      if (!toc.hidden) setToc(false);
      if (navList.classList.contains("is-open")) setMenu(false);
    }
  });

  mqMobile.addEventListener("change", () => setMenu(false));

  /* ---------- hide on scroll down, reveal on scroll up ---------- */

  let lastY = window.scrollY;
  let ticking = false;
  let currentIndex = -2;

  function showHead() { head.classList.remove("is-hidden"); }

  function canHide() {
    return toc.hidden && !navList.classList.contains("is-open") && !head.contains(document.activeElement);
  }

  function update() {
    ticking = false;
    const y = window.scrollY;
    const dy = y - lastY;

    if (y < head.offsetHeight + 40) showHead();
    else if (dy > 6 && canHide()) head.classList.add("is-hidden");
    else if (dy < -6) showHead();
    lastY = y;

    // reading progress across the essay only
    const vh = window.innerHeight;
    const start = essay.offsetTop - vh * 0.6;
    const end = essay.offsetTop + essay.offsetHeight - vh;
    const p = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
    progressFill.style.transform = `scaleX(${p})`;

    // current chapter = last chapter whose top has passed 40% of the viewport
    let idx = -1;
    chapters.forEach((c, i) => {
      if (c.getBoundingClientRect().top < vh * 0.4) idx = i;
    });

    if (idx !== currentIndex) {
      currentIndex = idx;
      runTitle.textContent = idx === -1 ? "Club de lectura de octubre" : chapters[idx].dataset.title;
      runChapter.textContent = idx === -1 ? "Portada" : `Cap. ${idx + 1} de ${chapters.length}`;
      runTitle.classList.remove("is-swap");
      void runTitle.offsetWidth;
      runTitle.classList.add("is-swap");
      tocLinks.forEach((a, i) => {
        if (i === idx) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }

    const leftWords = totalWords * (1 - p);
    const min = Math.ceil(leftWords / WPM);
    if (p === 0) runLeft.textContent = `${Math.ceil(totalWords / WPM)} min de lectura`.replace(" de lectura", narrow.matches ? "" : " de lectura");
    else if (p >= 0.99) runLeft.textContent = "Lectura terminada";
    else runLeft.textContent = `quedan ${min} min`;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener("resize", update);

  update();
})();
