document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const fakeLinks = document.querySelectorAll('a[href="#"]');

  fakeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
});