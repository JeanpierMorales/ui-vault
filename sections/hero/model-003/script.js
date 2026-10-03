const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const slides = $$(".hero-slide");
const thumbs = $$(".thumb");
const current = $("#currentSlide");
const title = $("#calloutTitle");
const prev = $("#prevBtn");
const next = $("#nextBtn");

const labels = ["Web platforms", "Software systems", "Digital products"];

let index = 0;
let timer = null;
let changing = false;

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================
   CHANGE SLIDE
========================= */

function setSlide(newIndex) {
  if (changing) return;

  changing = true;

  index = (newIndex + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  thumbs.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  current.textContent = String(index + 1).padStart(2, "0");

  if (!reduced) {
    title.animate(
      [
        {
          opacity: 0,
          transform: "translateY(7px)",
        },
        {
          opacity: 1,
          transform: "translateY(0)",
        },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(.16,1,.3,1)",
      },
    );
  }

  title.textContent = labels[index];

  setTimeout(() => (changing = false), 650);
}

/* =========================
   AUTOPLAY
========================= */

function startAuto() {
  clearInterval(timer);

  timer = setInterval(() => {
    setSlide(index + 1);
  }, 2000);
}

function restartAuto() {
  clearInterval(timer);

  startAuto();
}

/* =========================
   THUMB CLICK
========================= */

thumbs.forEach((thumb, i) => {
  thumb.addEventListener("click", () => {
    setSlide(i);

    restartAuto();
  });
});

/* =========================
   ARROWS
========================= */

next.addEventListener("click", () => {
  setSlide(index + 1);

  restartAuto();
});

prev.addEventListener("click", () => {
  setSlide(index - 1);

  restartAuto();
});

/* =========================
   INTRO REVEAL
========================= */

function reveal(
  selector,
  delay = 0,
  from = "translateY(20px)",
  duration = 950,
) {
  const el = $(selector);

  if (!el) return;

  if (reduced) {
    el.style.opacity = 1;

    return;
  }

  el.animate(
    [
      {
        opacity: 0,
        transform: from,
      },
      {
        opacity: 1,
        transform: "none",
      },
    ],
    {
      duration,
      delay,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "forwards",
    },
  );
}

reveal(".navbar", 100, "translateY(-14px)");

reveal(".contact-cta", 170, "translateY(-14px)");

reveal(".hero-copy", 300, "translateY(26px)", 1100);

reveal(".thumbnails", 520, "translateY(28px)", 1050);

reveal(".thumb-controls", 680, "translateY(14px)");

reveal(".bottom-copy", 760, "translateY(16px)");

reveal(".callout-main", 700, "translateX(25px)");

reveal(".callout-small", 820, "translateX(22px)");

reveal(".service-tags", 900, "translateY(20px)");

reveal(".slide-index", 1000, "translateY(10px)");

/* =========================
   THUMB DEPTH
========================= */

thumbs.forEach((thumb) => {
  thumb.addEventListener("pointermove", (e) => {
    if (reduced) return;

    const r = thumb.getBoundingClientRect();

    const x = (e.clientX - r.left) / r.width - 0.5;

    const y = (e.clientY - r.top) / r.height - 0.5;

    thumb.style.transform = `
          perspective(700px)
          rotateX(${y * -3}deg)
          rotateY(${x * 4}deg)
          translateY(-5px)
          `;
  });

  thumb.addEventListener("pointerleave", () => {
    thumb.style.transform = "";
  });
});

/* =========================
   POINTER DEPTH
========================= */

const hero = $("#hero");

let tx = 0;
let ty = 0;
let cx = 0;
let cy = 0;

hero.addEventListener("pointermove", (e) => {
  tx = e.clientX / innerWidth - 0.5;

  ty = e.clientY / innerHeight - 0.5;
});

hero.addEventListener("pointerleave", () => {
  tx = 0;
  ty = 0;
});

function render() {
  cx += (tx - cx) * 0.04;
  cy += (ty - cy) * 0.04;

  if (!reduced) {
    $(".hero-copy").style.transform = `
      translate3d(
        ${cx * 5}px,
        ${cy * 3}px,
        0
      )
      `;

    $(".thumbnails").style.transform = `
      translate3d(
        ${cx * 8}px,
        ${cy * 5}px,
        0
      )
      `;
  }

  requestAnimationFrame(render);
}

render();

/* =========================
   START
========================= */

setSlide(0);
startAuto();
