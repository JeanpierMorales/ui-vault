/* =========================================
   WEATHER CARD
   All temperatures are stored in °C. The unit toggle
   converts on display and every number tweens from
   what is on screen to the new value, so switching
   unit or city animates instead of snapping.
========================================= */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CITIES = {
  lisbon: {
    place: "Lisbon, Portugal",
    time: "Saturday · 2:00 PM",
    cond: "sun",
    label: "Sunny and clear",
    now: 27, hi: 29, lo: 18, feels: 28, humidity: 42, wind: 14,
    hours: [
      ["Now", "sun", 27], ["3 PM", "sun", 28], ["4 PM", "sun", 29], ["5 PM", "sun", 28],
      ["6 PM", "partly", 26], ["7 PM", "partly", 24], ["8 PM", "moon", 22], ["9 PM", "moon", 21],
      ["10 PM", "moon", 20], ["11 PM", "moon", 19], ["12 AM", "moon", 19], ["1 AM", "moon", 18],
    ],
  },
  london: {
    place: "London, UK",
    time: "Saturday · 2:00 PM",
    cond: "cloud",
    label: "Overcast skies",
    now: 16, hi: 18, lo: 11, feels: 15, humidity: 71, wind: 22,
    hours: [
      ["Now", "cloud", 16], ["3 PM", "cloud", 17], ["4 PM", "partly", 18], ["5 PM", "partly", 17],
      ["6 PM", "cloud", 16], ["7 PM", "cloud", 15], ["8 PM", "cloud", 14], ["9 PM", "rain", 13],
      ["10 PM", "rain", 13], ["11 PM", "cloud", 12], ["12 AM", "cloud", 12], ["1 AM", "moon", 11],
    ],
  },
  tokyo: {
    place: "Tokyo, Japan",
    time: "Saturday · 10:00 PM",
    cond: "rain",
    label: "Steady rain",
    now: 19, hi: 21, lo: 16, feels: 18, humidity: 88, wind: 18,
    hours: [
      ["Now", "rain", 19], ["11 PM", "rain", 19], ["12 AM", "rain", 18], ["1 AM", "rain", 18],
      ["2 AM", "cloud", 17], ["3 AM", "cloud", 17], ["4 AM", "cloud", 16], ["5 AM", "cloud", 16],
      ["6 AM", "partly", 17], ["7 AM", "partly", 18], ["8 AM", "sun", 19], ["9 AM", "sun", 20],
    ],
  },
};

const ICON_LABEL = { sun: "Sunny", partly: "Partly cloudy", cloud: "Cloudy", rain: "Rain", moon: "Clear night" };

const card = document.querySelector(".wx");
const panel = document.getElementById("wx-panel");
const tabs = [...card.querySelectorAll(".tab")];
const units = card.querySelector(".units");
const unitBtns = [...units.querySelectorAll(".units__btn")];
const list = card.querySelector(".hourly__list");
const status = document.getElementById("wx-status");

const state = { city: "lisbon", unit: "c" };

const toUnit = (c) => (state.unit === "f" ? Math.round(c * 1.8 + 32) : c);
const windValue = (kmh) => (state.unit === "f" ? Math.round(kmh * 0.621371) : kmh);
const ease = (t) => 1 - Math.pow(1 - t, 4);

/* Tween an element's integer text from its current value to `to` */
function tween(el, to, duration = 700) {
  const from = Number(el.textContent);
  if (reducedMotion || Number.isNaN(from) || from === to) {
    el.textContent = to;
    return;
  }
  cancelAnimationFrame(el._raf);
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * ease(t));
    if (t < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

function renderHours(data) {
  list.innerHTML = data.hours
    .map(([time, icon, c], i) => `
      <li class="hour${i === 0 ? " hour--now" : ""}" style="--h:${i}">
        <span class="hour__time">${time}</span>
        <svg role="img" aria-label="${ICON_LABEL[icon]}"><use href="#i-${icon}"></use></svg>
        <span class="hour__temp"><span data-hour-temp="${c}">${toUnit(c)}</span>°</span>
      </li>`)
    .join("");
  list.scrollLeft = 0;
}

/* Re-trigger the small rise animation on text that changed */
function replaySwap() {
  card.querySelectorAll("[data-swap]").forEach((el) => {
    el.classList.remove("is-swapped");
    void el.offsetWidth; // force reflow so the animation restarts
    el.classList.add("is-swapped");
  });
}

function render({ cityChanged = false } = {}) {
  const d = CITIES[state.city];
  card.dataset.cond = d.cond;

  card.querySelector('[data-field="place"]').textContent = d.place;
  card.querySelector('[data-field="time"]').textContent = d.time;
  card.querySelector('[data-field="cond"]').textContent = d.label;

  ["now", "hi", "lo", "feels"].forEach((key) => tween(card.querySelector(`[data-temp="${key}"]`), toUnit(d[key])));
  tween(card.querySelector('[data-field="humidity"]'), d.humidity);
  tween(card.querySelector("[data-wind]"), windValue(d.wind));
  card.querySelector("[data-wind-unit]").textContent = state.unit === "f" ? "mph" : "km/h";
  card.querySelector("[data-unit-label]").textContent = state.unit === "f" ? "Fahrenheit" : "Celsius";

  if (cityChanged) {
    renderHours(d);
    replaySwap();
  } else {
    // Same city, new unit: tween hourly numbers in place
    list.querySelectorAll("[data-hour-temp]").forEach((el) => tween(el, toUnit(Number(el.dataset.hourTemp))));
  }
}

/* ---------- Tabs (roving tabindex + arrow keys) ---------- */

function selectTab(tab, focus = false) {
  if (tab.dataset.city === state.city) return;
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
  });
  if (focus) tab.focus();
  panel.setAttribute("aria-labelledby", tab.id);
  state.city = tab.dataset.city;
  render({ cityChanged: true });

  const d = CITIES[state.city];
  status.textContent = `${d.place}: ${toUnit(d.now)} degrees, ${d.label}.`;
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (dir) {
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      selectTab(tabs[e.key === "Home" ? 0 : tabs.length - 1], true);
    }
  });
});

/* ---------- Unit toggle ---------- */

unitBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.unit === state.unit) return;
    state.unit = btn.dataset.unit;
    units.dataset.unit = state.unit;
    unitBtns.forEach((b) => b.setAttribute("aria-pressed", b === btn));
    render();
    status.textContent = `Showing ${state.unit === "f" ? "Fahrenheit" : "Celsius"}.`;
  });
});

renderHours(CITIES[state.city]);
