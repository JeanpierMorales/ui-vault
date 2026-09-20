(() => {
  const intro = document.querySelector('[data-mira-intro]');
  if (!intro || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const reveal = () => {
    const duration = 1500;
    const start = performance.now();
    intro.classList.add('is-revealing');

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
      intro.style.setProperty('--reveal', `${eased * 100}%`);
      if (progress < 1) requestAnimationFrame(animate);
      else intro.remove();
    };
    requestAnimationFrame(animate);
  };

  window.setTimeout(reveal, 1000);
})();
