const reduce = matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- mood widget ---------- */
const MOODS = {
  calma: ["Qué bueno. Es el mejor momento para crear hábitos que te sostengan.", "Prueba mindfulness guiado · jueves 7 pm"],
  ansioso: ["La ansiedad se trabaja mejor acompañado. Muchas personas notan cambios en 6 sesiones.", "Ver especialistas en ansiedad"],
  estres: ["Respira. Te proponemos un plan corto para bajar la carga, sin dejar tu rutina.", "Programa Estrés en 4 semanas"],
  triste: ["Gracias por decirlo. No tienes que resolverlo solo: hablemos esta semana.", "Reserva una llamada gratuita de 15 min"],
  agotado: ["El agotamiento no es falta de ganas. Empecemos por entender de dónde viene.", "Evaluación de burnout · gratis"],
  esperanza: ["Esa sensación es un buen punto de partida. Démosle forma juntos.", "Reserva tu primera sesión"],
};
const moodBtns = [...document.querySelectorAll("[data-mood]")];
const moodText = document.getElementById("moodText");
const moodCta = document.getElementById("moodCta");

function selectMood(btn) {
  moodBtns.forEach((b) => {
    const on = b === btn;
    b.setAttribute("aria-checked", String(on));
    b.tabIndex = on ? 0 : -1;
  });
  const [text, cta] = MOODS[btn.dataset.mood];
  moodText.classList.remove("swap");
  void moodText.offsetWidth;
  moodText.classList.add("swap");
  moodText.textContent = text;
  moodCta.hidden = false;
  moodCta.querySelector("span").textContent = cta;
}
moodBtns.forEach((b, i) => {
  b.tabIndex = i === 0 ? 0 : -1;
  b.addEventListener("click", () => selectMood(b));
  // flechas como un radiogroup nativo
  b.addEventListener("keydown", (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = moodBtns[(i + dir + moodBtns.length) % moodBtns.length];
    next.focus();
    selectMood(next);
  });
});

/* ---------- menu ---------- */
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => {
  menu.showModal();
  menuBtn.setAttribute("aria-expanded", "true");
});
menu.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", "false"));
menu.addEventListener("click", (e) => {
  if (e.target === menu || e.target.closest("[data-close], a")) menu.close();
});

/* ---------- entrance ---------- */
requestAnimationFrame(() => document.body.classList.add("ready"));

/* ---------- count-up stats ---------- */
const counters = document.querySelectorAll("[data-count]");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const el = entry.target;
      const end = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      if (reduce.matches) return;
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1100);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 },
);
counters.forEach((c) => io.observe(c));

/* ---------- scroll parallax (portrait + orbit) ---------- */
const hero = document.querySelector(".hero");
const portrait = document.querySelector(".portrait-frame img");
const orbit = [...document.querySelectorAll(".orbit-card")];
let ticking = false;

function onScroll() {
  ticking = false;
  if (reduce.matches) return;
  const y = window.scrollY;
  if (y < hero.offsetHeight) portrait.style.transform = `translateY(${y * 0.06}px) scale(${1.04 + y * 0.00003})`;
  orbit.forEach((card, i) => {
    const r = card.getBoundingClientRect();
    if (r.top > innerHeight || r.bottom < 0) return;
    const lift = (innerHeight - r.top) * (0.02 + (i % 2) * 0.012);
    card.style.setProperty("--lift", `${-lift}px`);
  });
}
addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true },
);
onScroll();
