const intro = document.getElementById("intro");

window.addEventListener("load", () => {
  // pequeño tiempo para que se vea la pantalla de bienvenida
  setTimeout(() => {
    document.body.classList.add("loaded");
    intro.classList.add("is-revealing");

    startContinuousReveal({
      element: intro,
      duration: 1500, // más rápido
      edgePercent: 1, // borde corto y clean
    });
  }, 1200);
});
//
function startContinuousReveal({ element, duration = 950, edgePercent = 100 }) {
  const start = performance.now();

  element.style.setProperty("--edge", `${edgePercent}%`);

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate(now) {
    const elapsed = now - start;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(rawProgress);
    const revealPercent = easedProgress * 100; // 100% reveal at the end of the duration

    element.style.setProperty("--reveal", `${revealPercent}%`);

    if (rawProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.remove();
    }
  }

  requestAnimationFrame(animate);
}
