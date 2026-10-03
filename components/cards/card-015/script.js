/* =========================================
   EVENT TICKET
   - Draws a QR-like pattern (decorative, seeded
     from the ticket code so it is stable).
   - "Add to calendar" downloads a real .ics file.
   - "Use ticket" tugs, then tears the stub off.
========================================= */

const ticket = document.querySelector(".ticket");
const qr = ticket.querySelector(".ticket__qr");
const useBtn = ticket.querySelector('[data-action="use"]');
const resetBtn = ticket.querySelector('[data-action="reset"]');
const calBtn = ticket.querySelector('[data-action="calendar"]');
const status = document.querySelector("[data-status]");
const usedTime = ticket.querySelector("[data-used-time]");
const stub = ticket.querySelector(".ticket__stub");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- QR-like pattern ---------- */

// Tiny deterministic PRNG (mulberry32) seeded from a string hash.
function rng(seedText) {
  let a = [...seedText].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawQR(svg, size = 25) {
  const rand = rng(svg.dataset.seed);
  const NS = "http://www.w3.org/2000/svg";
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

  // Finder squares sit in three corners, like a real QR code.
  const finders = [[0, 0], [size - 7, 0], [0, size - 7]];
  const inFinder = (x, y) =>
    finders.some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);

  // Data modules: one path is much lighter than hundreds of <rect>s.
  let d = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inFinder(x, y) && rand() > 0.52) d += `M${x} ${y}h1v1h-1z`;
    }
  }

  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);

  finders.forEach(([x, y]) => {
    const outer = document.createElementNS(NS, "path");
    // 7x7 ring (even-odd) + 3x3 centre
    outer.setAttribute(
      "d",
      `M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z M${x + 2} ${y + 2}h3v3h-3z`
    );
    outer.setAttribute("fill", "currentColor");
    outer.setAttribute("fill-rule", "evenodd");
    svg.appendChild(outer);
  });
}

drawQR(qr);

/* ---------- Add to calendar (.ics) ---------- */

const EVENT = {
  uid: "AN-2611-0418@aurora-nights.example",
  title: "Aurora Nights — Horizon World Tour",
  location: "Printworks London, Surrey Quays Rd, London SE16 7PJ",
  description: "Gate B · Section 104 · Row K · Seat 18. Doors 19:00.",
  start: "20261114T203000Z",
  end: "20261114T233000Z",
};

function downloadICS() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UI Vault//Event Ticket//EN",
    "BEGIN:VEVENT",
    `UID:${EVENT.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${EVENT.start}`,
    `DTEND:${EVENT.end}`,
    `SUMMARY:${EVENT.title}`,
    `LOCATION:${EVENT.location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${EVENT.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "aurora-nights.ics" });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let calTimer = 0;
calBtn.addEventListener("click", () => {
  downloadICS();
  const label = calBtn.querySelector(".btn__label");
  calBtn.classList.add("is-done");
  label.textContent = "Calendar file saved";
  status.textContent = "Calendar file downloaded.";
  clearTimeout(calTimer);
  calTimer = setTimeout(() => {
    calBtn.classList.remove("is-done");
    label.textContent = "Add to calendar";
  }, 2400);
});

/* ---------- Use ticket: tug, then tear ---------- */

useBtn.addEventListener("click", () => {
  if (ticket.classList.contains("is-torn")) return;

  const now = new Date();
  usedTime.textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const tear = () => {
    ticket.classList.remove("is-tugging");
    ticket.classList.add("is-torn");
    resetBtn.hidden = false;
    resetBtn.focus({ preventScroll: true });
    status.textContent = `Ticket used at ${usedTime.textContent}. Enjoy the show.`;
  };

  if (reducedMotion.matches) {
    tear();
  } else {
    ticket.classList.add("is-tugging");
    setTimeout(tear, 340);
  }
});

// Once the tear animation ends, hide the stub for good (keeps its grid space).
stub.addEventListener("animationend", (e) => {
  if (ticket.classList.contains("is-torn") && e.animationName !== "tug") {
    ticket.classList.add("is-gone");
  }
});

resetBtn.addEventListener("click", () => {
  ticket.classList.remove("is-torn", "is-gone");
  resetBtn.hidden = true;
  useBtn.focus({ preventScroll: true });
  status.textContent = "Ticket restored.";
});
