const booksContainer =
  document.getElementById("books");

const books =
  document.querySelectorAll(".book");

const addBook =
  document.querySelector(".add-book");


/* ==========================================
   ACCENT COLOR
========================================== */

books.forEach(book => {

  const accent =
    book.dataset.accent;

  book.style.setProperty(
    "--accent",
    accent
  );

});


/* ==========================================
   ACTIVATE BOOK
========================================== */

function activateBook(book) {

  books.forEach(item => {

    item.classList.remove(
      "active"
    );

  });


  book.classList.add(
    "active"
  );


  booksContainer.classList.add(
    "has-active"
  );

}


/* ==========================================
   DEACTIVATE ALL
========================================== */

function clearBooks() {

  books.forEach(book => {

    book.classList.remove(
      "active"
    );

  });


  booksContainer.classList.remove(
    "has-active"
  );

}


/* ==========================================
   DESKTOP HOVER
========================================== */

books.forEach(book => {

  book.addEventListener(
    "mouseenter",
    () => {

      activateBook(book);

    }
  );

});


/*
Cuando salimos completamente de la colección,
todo vuelve a su estado inicial.
*/

booksContainer.addEventListener(
  "mouseleave",
  () => {

    clearBooks();

  }
);


/* ==========================================
   CLICK / TOUCH
========================================== */

books.forEach(book => {

  book.addEventListener(
    "click",
    event => {

      /*
      Evitar cerrar al pulsar el botón interno.
      */

      if (
        event.target.closest(
          ".book-action"
        )
      ) {

        return;

      }


      const alreadyActive =
        book.classList.contains(
          "active"
        );


      if (alreadyActive) {

        clearBooks();

      }

      else {

        activateBook(book);

      }

    }
  );

});


/* ==========================================
   CURSOR SPOTLIGHT
========================================== */

books.forEach(book => {

  book.addEventListener(
    "mousemove",
    event => {

      const rect =
        book.getBoundingClientRect();


      const x =
        event.clientX -
        rect.left;


      const y =
        event.clientY -
        rect.top;


      book.style.setProperty(
        "--mouse-x",
        `${x}px`
      );


      book.style.setProperty(
        "--mouse-y",
        `${y}px`
      );

    }
  );

});


/* ==========================================
   SMALL 3D TILT
========================================== */

books.forEach(book => {

  const cover =
    book.querySelector(
      ".book-cover"
    );


  book.addEventListener(
    "mousemove",
    event => {

      if (
        !book.classList.contains(
          "active"
        )
      ) {

        return;

      }


      const rect =
        book.getBoundingClientRect();


      const normalizedX =

        (
          event.clientX -
          rect.left
        ) /

        rect.width;


      const normalizedY =

        (
          event.clientY -
          rect.top
        ) /

        rect.height;


      const rotateY =

        -12 +

        (
          normalizedX -
          0.5
        ) * 5;


      const rotateX =

        (
          0.5 -
          normalizedY
        ) * 3;


      cover.style.transform = `

        rotateY(${rotateY}deg)

        rotateX(${rotateX}deg)

        rotateZ(-1deg)

        translateY(-12px)

      `;

    }
  );


  book.addEventListener(
    "mouseleave",
    () => {

      cover.style.transform = "";

    }
  );

});


/* ==========================================
   ADD BOOK FEEDBACK
========================================== */

addBook.addEventListener(
  "click",
  () => {

    const icon =
      addBook.querySelector(
        ".plus i"
      );


    icon.className =
      "fa-solid fa-check";


    setTimeout(
      () => {

        icon.className =
          "fa-solid fa-plus";

      },
      850
    );

  }
);