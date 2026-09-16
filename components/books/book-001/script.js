const books =
  document.querySelectorAll(
    ".book-card"
  );

const addBook =
  document.querySelector(
    ".add-book-card"
  );


/* =========================================
   SELECT BOOK VISUALLY
========================================= */

books.forEach(book => {

  book.addEventListener(
    "click",
    () => {

      books.forEach(
        item => {

          item.classList.remove(
            "selected"
          );

        }
      );

      book.classList.add(
        "selected"
      );

    }
  );

});


/* =========================================
   ADD BOOK VISUAL FEEDBACK
========================================= */

addBook.addEventListener(
  "click",
  () => {

    const icon =
      addBook.querySelector(
        ".add-icon i"
      );

    icon.classList.remove(
      "fa-plus"
    );

    icon.classList.add(
      "fa-check"
    );


    setTimeout(
      () => {

        icon.classList.remove(
          "fa-check"
        );

        icon.classList.add(
          "fa-plus"
        );

      },
      900
    );

  }
);