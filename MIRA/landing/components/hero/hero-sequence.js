/* Ordered hero-frame sequence using the user's five supplied PNG frames. */
(() => {
  const sequence = document.querySelector('[data-hero-sequence]');
  const frames = sequence ? [...sequence.querySelectorAll('.hero-sequence__frame')] : [];

  if (frames.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let activeFrame = 0;
  let intervalId;
  let isVisible = true;

  const showFrame = (index) => {
    frames[activeFrame].classList.remove('is-active');
    activeFrame = index;
    frames[activeFrame].classList.add('is-active');
  };

  const stop = () => {
    window.clearInterval(intervalId);
    intervalId = undefined;
  };

  const start = () => {
    if (intervalId || !isVisible || document.hidden) return;

    intervalId = window.setInterval(() => {
      showFrame((activeFrame + 1) % frames.length);
    }, 800);
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) start();
    else stop();
  }, { threshold: .08 });

  visibilityObserver.observe(sequence);
  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
})();
