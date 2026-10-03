(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- photograph / plan reveal ---------- */
  const figure = document.getElementById("reveal");
  const stage = figure.querySelector(".reveal-stage");
  const range = figure.querySelector("input[type=range]");
  let raf = 0;

  const setPos = (v) => {
    const pos = Math.max(0, Math.min(100, v));
    figure.style.setProperty("--pos", pos.toFixed(2));
    range.value = Math.round(pos);
    range.setAttribute("aria-valuetext", `${Math.round(pos)} percent of the plan shown`);
  };

  const stopIntro = () => { cancelAnimationFrame(raf); raf = 0; };

  range.addEventListener("input", () => { stopIntro(); setPos(+range.value); });

  // On a fine pointer, hovering is enough: the seam follows the cursor.
  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    stopIntro();
    const r = stage.getBoundingClientRect();
    setPos(((e.clientX - r.left) / r.width) * 100);
  });

  // One authored moment: the photograph slides off the drawing the first time the figure is seen.
  const intro = () => {
    const from = 100, to = 58, dur = 1600;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(2, -10 * t);
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      setPos(from + (to - from) * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick); else raf = 0;
    };
    raf = requestAnimationFrame(tick);
  };

  if (!reduce.matches && "IntersectionObserver" in window) {
    setPos(100);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        io.disconnect();
        intro();
      }
    }, { threshold: 0.45 });
    io.observe(stage);
  }

  /* ---------- scale bar / project sheet ---------- */
  const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=85`;
  const projects = [
    {
      name: "Casa Ribeira",
      src: img("1600566753190-17f0baa2a6c3"),
      alt: "Casa Ribeira from the lane: a concrete base with a timber-clad upper floor and a deep entrance recess.",
      note: "The first commission: a house for three generations on a terrace above the Douro. The concrete base holds the slope; the upper floor is timber so it can be rebuilt without touching the ground.",
      year: "1998",
      structure: "Board-marked concrete base, larch frame above",
      visit: "Spring 2025, second roof replaced",
    },
    {
      name: "Matosinhos fish market arcade",
      src: img("1524230572899-a752b3835840"),
      alt: "The Matosinhos arcade, looking down the gallery.",
      note: "A covered route from the harbour to the auction hall. The fishmongers asked for shade and a floor they could hose down; we gave them nine arches and a floor that falls four centimetres to the drains.",
      year: "2004",
      structure: "Lime-plastered brick arches on concrete piers",
      visit: "Winter 2024, repainted once",
    },
    {
      name: "Lordelo social housing",
      src: img("1479839672679-a46483c0e7c8"),
      alt: "Lordelo housing: stacked white volumes with deep loggias cut into each flat.",
      note: "Sixty-four flats for the city housing trust. Every flat is dual-aspect and every loggia is deep enough for a table, which the tenants' association asked for by name.",
      year: "2011",
      structure: "Concrete cross-wall, mineral render",
      visit: "Winter 2016, loggia drains enlarged",
    },
    {
      name: "Geology annex, University of Coimbra",
      src: img("1488972685288-c3fd157d7c7a"),
      alt: "The geology annex: a facade of repeated concrete fins casting long shadows.",
      note: "Teaching rooms and a core store for rock samples. The fins are sized from the sun path so no bench sees direct light after ten in the morning.",
      year: "2017",
      structure: "Precast concrete fins on an in-situ frame",
      visit: "Winter 2022, no repairs needed",
    },
    {
      name: "Braga municipal archive",
      src: img("1487958449943-2429e8be8625"),
      alt: "Braga archive: a white folded volume rising over a glazed reading room.",
      note: "Eleven kilometres of shelving held at a steady eighteen degrees by thermal mass alone. The reading room sits under the fold so the paper never sees the sun.",
      year: "2023",
      structure: "Mass concrete vault, white cement finish",
      visit: "Due in the winter of 2028",
    },
  ];

  const buttons = [...document.querySelectorAll(".projects button")];
  const sheetImg = document.getElementById("sheet-img");
  const fields = {
    name: document.getElementById("sheet-name"),
    note: document.getElementById("sheet-note"),
    year: document.getElementById("sheet-year"),
    structure: document.getElementById("sheet-structure"),
    visit: document.getElementById("sheet-visit"),
  };
  let current = 1;
  let swapTimer = 0;

  // Warm the cache so the wipe never reveals an empty frame.
  const preload = () => projects.forEach((p) => { const i = new Image(); i.src = p.src; });
  if ("requestIdleCallback" in window) requestIdleCallback(preload); else setTimeout(preload, 1200);

  const show = (i) => {
    if (i === current) return;
    current = i;
    const p = projects[i];
    buttons.forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
    Object.keys(fields).forEach((k) => { fields[k].textContent = p[k]; });

    clearTimeout(swapTimer);
    sheetImg.classList.remove("is-entering");
    const swap = () => {
      sheetImg.src = p.src;
      sheetImg.alt = p.alt;
      sheetImg.classList.remove("is-leaving");
      void sheetImg.offsetWidth;
      sheetImg.classList.add("is-entering");
    };
    if (reduce.matches) { swap(); return; }
    sheetImg.classList.add("is-leaving");
    swapTimer = setTimeout(swap, 320);
  };

  buttons.forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));
  sheetImg.addEventListener("animationend", () => sheetImg.classList.remove("is-entering"));
})();
