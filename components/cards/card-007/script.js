/* =========================================
   ARTICLE CARDS
   Fade each cover in once it has decoded, so the
   warm placeholder colour shows instead of a
   half-painted image. Cached images resolve at once.
========================================= */

document.querySelectorAll(".post-card__media img").forEach((img) => {
  const reveal = () => img.classList.add("is-loaded");

  if (img.complete && img.naturalWidth > 0) {
    reveal();
  } else {
    img.addEventListener("load", reveal, { once: true });
    // On error keep the placeholder colour, but still show the alt text.
    img.addEventListener("error", reveal, { once: true });
  }
});
