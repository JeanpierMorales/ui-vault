/* =========================================
   PLAYLIST (simulated — no audio files)
========================================= */

// Cover and vinyl label share one URL, so each cover downloads only once
const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

/*
  Accent = the cover's own signature colour, never a UI default.
  Sampled from each image (60×60 canvas, hue histogram weighted by
  saturation × value), then lifted in lightness so it stays legible as
  text on the dark card. Covers 1 and 3 are mostly violet backdrop, so
  their accent is the most distinctive hue in the picture instead:
    Midnight Arcade — neon deck rings   sampled #c01b3d → #ff4d6a
    Paper Lanterns  — orange ink cloud  sampled #c84326 → #ff7a45
    Cold Bloom      — cyan wave         sampled #07b0e3 → #2cc4f0
*/
const tracks = [
  {
    title: "Midnight Arcade",
    artist: "Nova Lanes",
    duration: 222,
    art: "1470225620780-dba8ba36b745",
    accent: "#ff4d6a",
    liked: false,
  },
  {
    title: "Paper Lanterns",
    artist: "Hollis & June",
    duration: 245,
    art: "1541701494587-cb58502866ab",
    accent: "#ff7a45",
    liked: true,
  },
  {
    title: "Cold Bloom",
    artist: "Saint Arlo",
    duration: 198,
    art: "1618005182384-a83a8bd57fbe",
    accent: "#2cc4f0",
    liked: false,
  },
];

/* =========================================
   ELEMENTS
========================================= */

const player = document.querySelector(".player");
const artBox = player.querySelector(".player__art");
const vinylImg = player.querySelector(".player__vinyl-img");
const meta = player.querySelector(".player__meta");
const titleEl = player.querySelector(".player__title");
const artistEl = player.querySelector(".player__artist");
const queuePos = player.querySelector(".player__queue-pos");
const statusText = player.querySelector(".player__status-text");
const likeBtn = player.querySelector(".player__like");
const playBtn = player.querySelector(".player__play");
const prevBtn = player.querySelector(".player__prev");
const nextBtn = player.querySelector(".player__next");
const scrub = player.querySelector(".scrub");
const elapsedEl = player.querySelector(".player__elapsed");
const remainingEl = player.querySelector(".player__remaining");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Durations come from the shared vault tokens (../_shared/tokens.css) */
const rootStyle = getComputedStyle(document.documentElement);
const tokenMs = (name, fallback) => parseFloat(rootStyle.getPropertyValue(name)) || fallback;
const D_FAST = tokenMs("--d-fast", 150);
const D_SLOW = tokenMs("--d-slow", 400);

/* =========================================
   STATE
========================================= */

let index = 0;
let position = 72; // seconds into the current track
let playing = false;
let dragging = false;
let lastTick = 0;
let rafId = 0;
let swapTimer = 0;

const current = () => tracks[index];

const formatTime = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/* =========================================
   RENDER
========================================= */

function renderProgress() {
  const { duration } = current();
  const p = Math.min(1, position / duration);

  scrub.style.setProperty("--p", p.toFixed(4));
  elapsedEl.textContent = formatTime(position);
  remainingEl.textContent = `-${formatTime(duration - Math.floor(position))}`;

  scrub.setAttribute("aria-valuemax", String(duration));
  scrub.setAttribute("aria-valuenow", String(Math.floor(position)));
  scrub.setAttribute(
    "aria-valuetext",
    `${formatTime(position)} of ${formatTime(duration)}`
  );
}

function renderPlayState() {
  player.classList.toggle("is-playing", playing);
  playBtn.setAttribute("aria-pressed", String(playing));
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  statusText.textContent = playing ? "Now playing" : "Paused";
}

function renderLike() {
  likeBtn.setAttribute("aria-pressed", String(current().liked));
}

/* =========================================
   PLAYBACK LOOP
========================================= */

function tick(now) {
  const delta = (now - lastTick) / 1000;
  lastTick = now;

  // While dragging, the pointer owns the position
  if (!dragging) {
    position += delta;

    if (position >= current().duration) {
      changeTrack(1);
    }

    renderProgress();
  }

  rafId = requestAnimationFrame(tick);
}

function setPlaying(value) {
  playing = value;
  cancelAnimationFrame(rafId);

  if (playing) {
    lastTick = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  renderPlayState();
}

/* =========================================
   TRACK CHANGE with art + text crossfade
========================================= */

function changeTrack(step) {
  index = (index + step + tracks.length) % tracks.length;
  position = 0;

  const track = current();
  document.documentElement.style.setProperty("--accent", track.accent);

  // Art: stack the new cover on top and fade it in, then drop the old one
  const oldImgs = artBox.querySelectorAll(".player__art-img");
  const next = new Image();
  next.className = "player__art-img";
  next.alt = `Album cover of ${track.title} by ${track.artist}`;
  next.draggable = false;
  next.src = img(track.art);
  artBox.appendChild(next);

  const reveal = () => {
    requestAnimationFrame(() => {
      next.classList.add("is-current");
      oldImgs.forEach((old) => old.classList.remove("is-current"));
      setTimeout(() => oldImgs.forEach((old) => old.remove()), D_SLOW + 50);
    });
  };

  // Wait for the image so the fade never shows an empty frame
  if (next.complete) reveal();
  else next.decode().then(reveal, reveal);

  // Vinyl label: quick dip while the source changes
  vinylImg.style.opacity = "0";
  setTimeout(() => {
    vinylImg.src = img(track.art);
    vinylImg.style.opacity = "";
  }, D_FAST);

  // Text: fade out, swap, fade back in
  clearTimeout(swapTimer);
  meta.classList.add("is-swapping");
  swapTimer = setTimeout(() => {
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    queuePos.textContent = String(index + 1);
    meta.classList.remove("is-swapping");
  }, D_FAST);

  renderLike();
  renderProgress();
}

/* =========================================
   BUTTONS
========================================= */

playBtn.addEventListener("click", () => setPlaying(!playing));
prevBtn.addEventListener("click", () => changeTrack(-1));
nextBtn.addEventListener("click", () => changeTrack(1));

likeBtn.addEventListener("click", () => {
  current().liked = !current().liked;
  renderLike();

  if (current().liked && !reducedMotion.matches) {
    likeBtn.classList.remove("is-popping");
    void likeBtn.offsetWidth; // restart the pop animation
    likeBtn.classList.add("is-popping");
  }
});

likeBtn.addEventListener("animationend", () => likeBtn.classList.remove("is-popping"));

/* =========================================
   SCRUBBING: pointer (click + drag) and keys
========================================= */

function seekFromPointer(event) {
  const rect = scrub.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  position = ratio * current().duration;
  renderProgress();
}

scrub.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  dragging = true;
  scrub.classList.add("is-dragging");
  scrub.setPointerCapture(event.pointerId);
  seekFromPointer(event);
});

scrub.addEventListener("pointermove", (event) => {
  if (dragging) seekFromPointer(event);
});

const endDrag = () => {
  if (!dragging) return;
  dragging = false;
  scrub.classList.remove("is-dragging");
  lastTick = performance.now(); // don't count the drag time as playback
};

scrub.addEventListener("pointerup", endDrag);
scrub.addEventListener("pointercancel", endDrag);
scrub.addEventListener("lostpointercapture", endDrag);

scrub.addEventListener("keydown", (event) => {
  const { duration } = current();
  const steps = {
    ArrowRight: 5,
    ArrowUp: 5,
    ArrowLeft: -5,
    ArrowDown: -5,
    PageUp: 15,
    PageDown: -15,
  };

  if (event.key in steps) {
    position += steps[event.key];
  } else if (event.key === "Home") {
    position = 0;
  } else if (event.key === "End") {
    position = duration - 1;
  } else {
    return;
  }

  event.preventDefault();
  position = Math.min(duration - 1, Math.max(0, position));
  renderProgress();
});

/* =========================================
   INIT
========================================= */

document.documentElement.style.setProperty("--accent", current().accent);

// Warm the cache so track changes crossfade instantly
tracks.forEach((track) => {
  new Image().src = img(track.art);
});

renderLike();
renderProgress();

// Autoplay the demo only when motion is welcome
setPlaying(!reducedMotion.matches);
