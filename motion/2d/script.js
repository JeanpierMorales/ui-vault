const stages = [...document.querySelectorAll('[data-sequence]')];
const playbackButton = document.querySelector('[data-playback]');
const playbackLabel = document.querySelector('[data-playback-label]');
const playbackStatus = document.querySelector('[data-playback-status]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let isPaused = reducedMotion.matches;
let pageVisible = !document.hidden;
let timerId;

const sequences = stages.map((stage) => ({
  stage,
  image: stage.querySelector('img'),
  frames: stage.dataset.frames.split('|'),
  index: 0,
}));

function renderSequence(sequence, nextIndex) {
  sequence.index = nextIndex;
  sequence.image.src = sequence.frames[sequence.index];
}

function advanceAll() {
  sequences.forEach((sequence) => {
    renderSequence(sequence, (sequence.index + 1) % sequence.frames.length);
  });
}

function stop() {
  window.clearInterval(timerId);
  timerId = undefined;
}

function start() {
  if (timerId || isPaused || !pageVisible) return;
  timerId = window.setInterval(advanceAll, 200);
}

function syncPlayback() {
  stop();
  start();

  playbackButton.setAttribute('aria-pressed', String(isPaused));
  playbackLabel.textContent = isPaused ? 'Play all' : 'Pause all';
  playbackStatus.textContent = isPaused
    ? 'All nine sequences are paused.'
    : 'All nine sequences are playing.';
}

playbackButton.addEventListener('click', () => {
  isPaused = !isPaused;
  syncPlayback();
});

document.addEventListener('visibilitychange', () => {
  pageVisible = !document.hidden;
  syncPlayback();
});

reducedMotion.addEventListener('change', (event) => {
  isPaused = event.matches;
  syncPlayback();
});

syncPlayback();
