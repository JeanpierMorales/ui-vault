const email =
  document.getElementById("email");

const password =
  document.getElementById("password");

const loginButton =
  document.getElementById("loginButton");

const togglePassword =
  document.getElementById("togglePassword");


/* ================================
   PASSWORD TOGGLE
================================ */

togglePassword.addEventListener(
  "click",
  () => {

    const icon =
      togglePassword.querySelector("i");

    if (
      password.type === "password"
    ) {

      password.type = "text";

      icon.classList.remove(
        "fa-eye"
      );

      icon.classList.add(
        "fa-eye-slash"
      );

    } else {

      password.type =
        "password";

      icon.classList.remove(
        "fa-eye-slash"
      );

      icon.classList.add(
        "fa-eye"
      );

    }

  }
);


/* ================================
   VISUAL VALIDATION
================================ */

loginButton.addEventListener(
  "click",
  () => {

    validateField(email);
    validateField(password);

  }
);


function validateField(input) {

  const field =
    input.closest(".field");

  if (!input.value.trim()) {

    field.classList.add(
      "invalid"
    );

  } else {

    field.classList.remove(
      "invalid"
    );

  }

}


/* ================================
   REMOVE ERROR WHILE TYPING
================================ */

[email, password]
  .forEach(input => {

    input.addEventListener(
      "input",
      () => {

        if (
          input.value.trim()
        ) {

          input
            .closest(".field")
            .classList.remove(
              "invalid"
            );

        }

      }
    );

  });


/* ================================
   EYES FOLLOW CURSOR
================================ */

const pupils =
  document.querySelectorAll(
    ".pupil"
  );


document.addEventListener(
  "mousemove",
  event => {

    pupils.forEach(pupil => {

      const eye =
        pupil.parentElement;

      const rect =
        eye.getBoundingClientRect();

      const centerX =
        rect.left +
        rect.width / 2;

      const centerY =
        rect.top +
        rect.height / 2;


      const deltaX =
        event.clientX -
        centerX;

      const deltaY =
        event.clientY -
        centerY;


      const angle =
        Math.atan2(
          deltaY,
          deltaX
        );


      const maxDistance = 8;

      const x =
        Math.cos(angle)
        * maxDistance;

      const y =
        Math.sin(angle)
        * maxDistance;


      pupil.style.transform =
        `translate(${x}px, ${y}px)`;

    });

  }
);