const frames = [
  '../../MIRA/landing/assets/hero/book-frame-01.png',
  '../../MIRA/landing/assets/hero/book-frame-02.png',
  '../../MIRA/landing/assets/hero/book-frame-03.png',
  '../../MIRA/landing/assets/hero/book-frame-04.png',
  '../../MIRA/landing/assets/hero/book-frame-05.png',
];

const bookFrames = [...document.querySelectorAll('[data-book-frame]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frameIndex = 0;
let frameTimer;

function drawFrames() {
  bookFrames.forEach((image) => { image.src = frames[frameIndex]; });
}

function stopFrames() { window.clearInterval(frameTimer); frameTimer = undefined; }
function startFrames() {
  if (frameTimer || reducedMotion.matches || document.hidden) return;
  frameTimer = window.setInterval(() => { frameIndex = (frameIndex + 1) % frames.length; drawFrames(); }, 800);
}

document.querySelectorAll('[data-mode-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.palette-card');
    const isDark = card.dataset.mode === 'dark';
    card.dataset.mode = isDark ? 'light' : 'dark';
    card.querySelector('.mini-interface > span').textContent = isDark ? 'Light mode' : 'Black mode';
    button.textContent = isDark ? 'View black' : 'View light';
  });
});

document.querySelectorAll('[data-cursor-fill]').forEach((button) => {
  const bubble = button.querySelector('.cursor-bubble');
  button.addEventListener('mouseenter', (event) => {
    const rect = button.getBoundingClientRect();
    bubble.style.left = `${event.clientX - rect.left}px`;
    bubble.style.top = `${event.clientY - rect.top}px`;
  });
});

const selected = new Set();
const status = document.querySelector('[data-selection-status]');
function updateSelection() {
  status.textContent = selected.size ? [...selected].join(' · ') : 'No directions selected yet.';
}
document.querySelectorAll('[data-select]').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.select;
    const card = button.closest('article');
    if (selected.has(name)) selected.delete(name); else selected.add(name);
    card.classList.toggle('is-selected', selected.has(name));
    updateSelection();
  });
});
document.querySelector('[data-reset]').addEventListener('click', () => {
  selected.clear();
  document.querySelectorAll('.is-selected').forEach((card) => card.classList.remove('is-selected'));
  updateSelection();
});

document.addEventListener('visibilitychange', () => { stopFrames(); startFrames(); });
reducedMotion.addEventListener('change', () => { stopFrames(); startFrames(); });
drawFrames();
startFrames();
