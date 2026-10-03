/* =========================================
   TEAM FLIP CARDS
   A card flips when:
   - a mouse hovers it (pointerenter/leave),
   - it is tapped/clicked anywhere (except links),
   - its toggle button is pressed (Enter / Space),
   - keyboard focus lands on a link on its back.
   aria-pressed on the toggle always mirrors what
   is on screen.
========================================= */

const members = document.querySelectorAll(".member");

members.forEach((card) => {
  const toggle = card.querySelector(".member__toggle");
  const name = card.querySelector(".member__name").textContent.trim();

  // Why the card is flipped: "focus" flips are undone when focus leaves.
  let reason = null;

  function setFlipped(flipped, why = null) {
    card.classList.toggle("is-flipped", flipped);
    toggle.setAttribute("aria-pressed", String(flipped));
    toggle.setAttribute("aria-label", `${flipped ? "Hide" : "Show"} bio for ${name}`);
    reason = flipped ? why : null;
  }

  const isFlipped = () => card.classList.contains("is-flipped");

  // Mouse hover only; touch and pen rely on tap.
  card.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") setFlipped(true, "hover");
  });
  card.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") setFlipped(false);
  });

  // Click/tap anywhere on the card (the button click bubbles here too).
  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    setFlipped(!isFlipped(), "toggle");
  });

  // Tabbing onto a social link on the back reveals the back.
  card.addEventListener("focusin", (e) => {
    if (e.target.closest(".member__social") && !isFlipped()) setFlipped(true, "focus");
  });
  card.addEventListener("focusout", (e) => {
    if (reason === "focus" && !card.contains(e.relatedTarget)) setFlipped(false);
  });
});
