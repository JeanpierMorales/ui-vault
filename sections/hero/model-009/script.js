(() => {
  const SAILINGS = [
    { from: "Geiranger", to: "Hellesylt", fjord: "Geirangerfjord", duration: "1 h 05 min", vessel: "MF Brattli", offset: 14, note: "On time" },
    { from: "Lavik", to: "Oppedal", fjord: "Sognefjord", duration: "20 min", vessel: "MF Lyngvær", offset: 39, note: "On time" },
    { from: "Flåm", to: "Gudvangen", fjord: "Nærøyfjord", duration: "2 h 10 min", vessel: "MS Tindra", offset: 74, note: "Car deck full" },
    { from: "Bergen", to: "Balestrand", fjord: "Sognefjord", duration: "4 h 10 min", vessel: "MS Skarvik", offset: 124, note: "Cabins open" }
  ];
  const BOARDING_WINDOW = 20 * 60 * 1000;

  const $ = (id) => document.getElementById(id);
  const clock = $("clock");
  const countdown = $("countdown");
  const line = $("route-line");
  const fields = { from: $("sel-from"), to: $("sel-to"), duration: $("sel-duration"), vessel: $("sel-vessel"), fjord: $("sel-fjord") };
  const buttons = [...document.querySelectorAll("#sailings button")];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  let selected = 0;
  let departures = [];

  const pad = (n) => String(n).padStart(2, "0");
  const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  // Anchor the demo timetable to the next five-minute mark so the board is always "live".
  function schedule() {
    const base = new Date();
    base.setSeconds(0, 0);
    base.setMinutes(Math.ceil((base.getMinutes() + 1) / 5) * 5);
    departures = SAILINGS.map((s) => new Date(base.getTime() + (s.offset - 5) * 60000));
    buttons.forEach((btn, i) => {
      const t = btn.querySelector("time");
      t.textContent = hhmm(departures[i]);
      t.dateTime = departures[i].toISOString();
    });
  }

  function drawRoute() {
    if (reduceMotion.matches || !line.animate) return;
    line.getAnimations().forEach((a) => a.cancel());
    line.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }

  function select(i, animate = true) {
    selected = i;
    const s = SAILINGS[i];
    buttons.forEach((btn, j) => btn.setAttribute("aria-pressed", String(j === i)));
    Object.keys(fields).forEach((k) => { fields[k].textContent = s[k]; });
    tick();
    if (animate) drawRoute();
  }

  function tick() {
    const now = Date.now();
    if (departures[0] - now <= 0) schedule();

    clock.textContent = hhmm(new Date(now));

    const left = Math.max(0, departures[selected] - now);
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const sec = Math.floor((left % 60000) / 1000);
    countdown.textContent = `${pad(h)}:${pad(m)}:${pad(sec)}`;

    buttons.forEach((btn, i) => {
      const status = btn.querySelector(".status");
      const boarding = departures[i] - now <= BOARDING_WINDOW;
      status.textContent = boarding ? "Boarding" : SAILINGS[i].note;
      status.classList.toggle("is-boarding", boarding);
    });
  }

  buttons.forEach((btn, i) => btn.addEventListener("click", () => {
    if (i !== selected) select(i);
  }));

  // Arrow keys move through the board like a list.
  $("sailings").addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0 || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  });

  schedule();
  select(0);
  setInterval(tick, 1000);

  // Mobile menu
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector(".menu-toggle");
  const label = toggle.querySelector(".visually-hidden");

  function setMenu(open) {
    topbar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close menu" : "Menu";
  }

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!topbar.contains(e.target)) setMenu(false);
  });
})();
