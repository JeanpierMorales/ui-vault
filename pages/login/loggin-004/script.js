const authContainer =
  document.getElementById("authContainer");

const signUpButton =
  document.getElementById("signUpButton");

const signInButton =
  document.getElementById("signInButton");


/* ================================
   SHOW SIGN UP
================================ */

signUpButton.addEventListener(
  "click",
  () => {

    authContainer.classList.add(
      "register-active"
    );

  }
);


/* ================================
   SHOW SIGN IN
================================ */

signInButton.addEventListener(
  "click",
  () => {

    authContainer.classList.remove(
      "register-active"
    );

  }
);