const badge = document.getElementById("idBadge");
const card = badge.querySelector(".id-card");
const strap = badge.querySelector(".id-badge__strap");

badge.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const rect = badge.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const px = x / rect.width;
  const py = y / rect.height;

  const rotateY = (px - 0.5) * 8;
  const rotateX = (0.5 - py) * 6;

  card.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateY(-4px)
  `;

  strap.style.transform = `
    translateX(-50%)
    rotate(${rotateY * 0.45}deg)
  `;

  card.style.setProperty("--mx", `${px * 100}%`);
  card.style.setProperty("--my", `${py * 100}%`);
});

badge.addEventListener("pointerleave", () => {
  card.style.transform = `
    rotateX(0deg)
    rotateY(0deg)
    translateY(0)
  `;

  strap.style.transform = `
    translateX(-50%)
    rotate(0deg)
  `;
});