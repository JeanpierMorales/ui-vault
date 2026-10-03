/* =========================================
   NOTIFICATION STACK
   - Collapsed: cards pile up behind the first one.
   - Mouse hover or click fans them out; the header
     button toggles the same state (aria-expanded).
   - Dismiss with the X or a horizontal swipe. The
     remaining cards glide into place (FLIP), and an
     Undo toast can put the card back.
========================================= */

const section = document.querySelector(".notif");
const list = section.querySelector(".notif__list");
const toggle = section.querySelector(".notif__toggle");
const countEl = section.querySelector("[data-count]");
const empty = section.querySelector(".notif__empty");
const hint = section.querySelector(".notif__hint");

const toast = document.querySelector(".toast");
const toastText = toast.querySelector("[data-toast-text]");
const undoBtn = toast.querySelector(".toast__undo");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const PEEK = 10; // px of each card showing under the one in front
const SCALE_STEP = 0.05;
const MAX_VISIBLE = 3; // cards drawn in the collapsed pile
const TOAST_MS = 5000;

let expanded = false; // what is on screen
let pinned = false; // opened by click/button (hover-out won't close it)

const notes = () => [...list.querySelectorAll(".note:not(.is-leaving)")];

/* ---------- Layout ---------- */

// Transform that puts card i in the pile. Cards align on their
// bottom edge (transform-origin: bottom) so taller cards still peek.
function pileTransform(el, i, first) {
  const k = Math.min(i, MAX_VISIBLE - 1);
  const targetBottom = first.offsetTop + first.offsetHeight + k * PEEK;
  const dy = targetBottom - (el.offsetTop + el.offsetHeight);
  return `translateY(${dy}px) scale(${1 - k * SCALE_STEP})`;
}

function targetFor(el, i, items) {
  return expanded ? "translateY(0px) scale(1)" : pileTransform(el, i, items[0]);
}

function applyLayout() {
  const items = notes();

  items.forEach((el, i) => {
    el.style.zIndex = String(items.length - i);
    el.style.transform = targetFor(el, i, items);
    el.classList.toggle("is-behind", !expanded && i > 0);
    el.classList.toggle("is-hidden", !expanded && i >= MAX_VISIBLE);
    // Cards buried in the pile can't be reached by keyboard or clicks.
    el.inert = !expanded && i > 0;
  });

  // Keep the hint right under the pile, and centre the collapsed
  // pile in the space the expanded list occupies.
  let shift = 0;
  if (items.length) {
    const first = items[0];
    const pileBottom = first.offsetTop + first.offsetHeight + Math.min(items.length - 1, MAX_VISIBLE - 1) * PEEK;
    hint.style.setProperty("--hint-y", `${pileBottom - list.offsetHeight}px`);
    if (!expanded) shift = Math.round((list.offsetHeight - pileBottom) / 2);
  }
  section.style.setProperty("--shift", `${shift}px`);

  section.classList.toggle("is-collapsed", !expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
  toggle.textContent = expanded ? "Stack" : "Show all";

  const n = items.length;
  countEl.textContent = String(n);
  countEl.hidden = n === 0;
  toggle.hidden = n < 2;
  empty.hidden = n > 0;
  hint.hidden = n < 2;
}

function setExpanded(value, { pin = pinned } = {}) {
  pinned = pin;
  if (expanded === value) return;
  expanded = value;
  applyLayout();
}

/* ---------- FLIP helper ----------
   Snapshot each card's layout position + transform, run the
   DOM change, then start every card from where it visually was. */

function flip(change) {
  const before = new Map(
    notes().map((el) => [el, { top: el.offsetTop, transform: el.style.transform }])
  );

  // The section is centred on the page, so its own position moves too.
  const secTop = section.offsetTop;
  const secShift = parseFloat(section.style.getPropertyValue("--shift")) || 0;

  change();
  applyLayout();

  if (reducedMotion.matches) return;

  const newShift = parseFloat(section.style.getPropertyValue("--shift")) || 0;
  section.style.transition = "none";
  section.style.setProperty("--shift", `${secShift + secTop - section.offsetTop}px`);
  section.offsetHeight;
  section.style.transition = "";
  section.style.setProperty("--shift", `${newShift}px`);

  notes().forEach((el) => {
    const old = before.get(el);
    if (!old) return;
    const shift = old.top - el.offsetTop;
    if (!shift && old.transform === el.style.transform) return;

    const target = el.style.transform;
    el.style.transition = "none";
    el.style.transform = `translateY(${shift}px) ${old.transform}`;
    el.offsetHeight; // commit the starting frame
    el.style.transition = "";
    el.style.transform = target;
  });
}

/* ---------- Dismiss + undo ---------- */

const trash = []; // [{ el, next }] most recent last
let toastTimer = 0;

function titleOf(el) {
  return el.querySelector(".note__title").textContent.trim();
}

function dismiss(el, direction = 1) {
  if (el.classList.contains("is-leaving")) return;

  // Where focus should go if it was inside this card
  const items = notes();
  const i = items.indexOf(el);
  const hadFocus = el.contains(document.activeElement);
  const neighbour = items[i + 1] || items[i - 1];

  el.classList.add("is-leaving");
  el.classList.remove("is-dragging");
  el.style.transform = `translateX(${direction * 110}%) rotate(${direction * 4}deg)`;
  el.style.opacity = "0";

  const finish = () => {
    flip(() => {
      trash.push({ el, next: el.nextElementSibling });
      el.remove();
      el.classList.remove("is-leaving");
      el.style.opacity = "";
    });
    showToast(`Dismissed “${titleOf(el)}”`);
    if (hadFocus) {
      (neighbour ? neighbour.querySelector(".note__close") : undoBtn).focus({ preventScroll: true });
    }
  };

  if (reducedMotion.matches) finish();
  else setTimeout(finish, 260);
}

function undo() {
  const last = trash.pop();
  if (!last) return;
  const { el, next } = last;

  flip(() => {
    // Re-insert where it was (its old neighbour may be gone too)
    if (next && next.parentNode === list) list.insertBefore(el, next);
    else list.appendChild(el);
  });

  // Fade the restored card in from a small offset.
  if (!reducedMotion.matches) {
    const target = el.style.transform;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = `translateX(-24px) ${target}`;
    el.offsetHeight;
    el.style.transition = "";
    el.style.opacity = "";
    el.style.transform = target;
  }

  if (trash.length) showToast(`Dismissed “${titleOf(trash[trash.length - 1].el)}”`);
  else hideToast();

  if (expanded || notes()[0] === el) el.querySelector(".note__close").focus({ preventScroll: true });
}

function showToast(message) {
  toastText.textContent = message;
  toast.style.setProperty("--toast-ms", `${TOAST_MS}ms`);
  toast.classList.add("is-visible");
  // Restart the countdown bar
  toast.classList.remove("is-counting");
  toast.offsetWidth;
  toast.classList.add("is-counting");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, TOAST_MS);
}

function hideToast() {
  clearTimeout(toastTimer);
  // Don't strand keyboard focus on a button that is disappearing.
  if (toast.contains(document.activeElement)) {
    const first = notes()[0];
    (first ? first.querySelector(".note__close") : empty).focus({ preventScroll: true });
  }
  toast.classList.remove("is-visible", "is-counting");
  trash.length = 0; // once the toast is gone, dismissals are final
}

// Pause the countdown while the pointer or focus is on the toast.
toast.addEventListener("pointerenter", () => clearTimeout(toastTimer));
toast.addEventListener("pointerleave", () => {
  if (toast.classList.contains("is-visible")) toastTimer = setTimeout(hideToast, 2000);
});
undoBtn.addEventListener("click", undo);

/* ---------- Expand / collapse ---------- */

toggle.addEventListener("click", () => setExpanded(!expanded, { pin: !expanded }));

// Mouse hover over any card fans the pile out; leaving the list closes it
list.addEventListener("pointerover", (e) => {
  if (e.pointerType === "mouse" && e.target.closest(".note")) setExpanded(true);
});
list.addEventListener("pointerleave", (e) => {
  if (e.pointerType === "mouse" && !pinned) setExpanded(false);
});

list.addEventListener("click", (e) => {
  const card = e.target.closest(".note");
  if (!card) return;

  const close = e.target.closest(".note__close");
  if (close) {
    dismiss(card, 1);
    return;
  }

  if (suppressClick) return;
  // Tapping/clicking the pile opens it and keeps it open.
  if (!expanded || !pinned) setExpanded(true, { pin: true });
});

/* ---------- Swipe to dismiss ---------- */

let drag = null;
let suppressClick = false;

list.addEventListener("pointerdown", (e) => {
  const card = e.target.closest(".note");
  if (!card || e.button !== 0 || e.target.closest("button")) return;
  // In the pile only the front card can be swiped
  if (!expanded && card !== notes()[0]) return;

  drag = {
    card,
    id: e.pointerId,
    x: e.clientX,
    y: e.clientY,
    t: performance.now(),
    dx: 0,
    active: false,
    base: card.style.transform,
  };
  suppressClick = false;
});

list.addEventListener("pointermove", (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const mx = e.clientX - drag.x;
  const my = e.clientY - drag.y;

  if (!drag.active) {
    if (Math.abs(mx) < 6 || Math.abs(mx) < Math.abs(my)) return;
    drag.active = true;
    drag.card.setPointerCapture(drag.id);
    drag.card.classList.add("is-dragging");
  }

  drag.dx = mx;
  const w = drag.card.offsetWidth;
  const progress = Math.min(Math.abs(mx) / w, 1);
  drag.card.style.transform = `translateX(${mx}px) rotate(${(mx / w) * 3}deg) ${drag.base}`;
  drag.card.style.opacity = String(1 - progress * 0.7);
});

function endSwipe(e) {
  if (!drag || e.pointerId !== drag.id) return;
  const { card, dx, active, t } = drag;
  drag = null;
  if (!active) return;

  suppressClick = true; // the click that follows a drag isn't a tap
  setTimeout(() => (suppressClick = false), 0);

  const velocity = Math.abs(dx) / (performance.now() - t);
  const past = Math.abs(dx) > card.offsetWidth * 0.35 || (velocity > 0.5 && Math.abs(dx) > 30);

  card.classList.remove("is-dragging");
  if (past) {
    dismiss(card, Math.sign(dx));
  } else {
    // Spring back
    card.style.opacity = "";
    applyLayout();
  }
}

list.addEventListener("pointerup", endSwipe);
list.addEventListener("pointercancel", endSwipe);

/* ---------- Init ---------- */

// Re-measure on resize (text wrapping changes card heights).
new ResizeObserver(() => applyLayout()).observe(list);

applyLayout();
requestAnimationFrame(() => requestAnimationFrame(() => section.classList.remove("is-booting")));
