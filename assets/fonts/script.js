const buttons = document.querySelectorAll("#filters button");
const cards = document.querySelectorAll(".card");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // Quitar estado activo de todos los botones
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Activar el botón seleccionado
    button.classList.add("active");

    const selectedFilter = button.dataset.filter;

    // Filtrar cards
    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");

      const shouldShow =
        selectedFilter === "all" ||
        categories.includes(selectedFilter);

      card.classList.toggle("hidden", !shouldShow);
    });
  });
});