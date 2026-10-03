/* =========================================
   READ MORE TOGGLE
   The height animation is pure CSS
   (grid-template-rows 0fr → 1fr on .is-open);
   JS only flips state + accessible labels.
========================================= */

document.querySelectorAll(".review__toggle").forEach((button) => {
  const review = button.closest(".review");
  const label = button.querySelector(".review__toggle-label");

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(open));
    review.classList.toggle("is-open", open);
    label.textContent = open ? "Show less" : "Read more";
  });
});
