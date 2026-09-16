const cards = document.querySelectorAll(".travel-card");

cards.forEach((card) => {
  const favoriteButtons = card.querySelectorAll(".travel-card__favorite");

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const willBeActive = !button.classList.contains("is-active");

      favoriteButtons.forEach((item) => {
        item.classList.toggle("is-active", willBeActive);
      });
    });
  });
});