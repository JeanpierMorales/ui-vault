const moreButtons =
  document.querySelectorAll(".more-link");

moreButtons.forEach(button => {
  button.addEventListener("click", () => {
    const description =
      button.previousElementSibling;

    const expanded =
      description.classList.contains("expanded");

    if (expanded) {
      description.classList.remove("expanded");
      button.textContent = "more";
    } else {
      description.classList.add("expanded");
      button.textContent = "less";
    }
  });
});