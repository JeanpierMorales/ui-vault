const form = document.querySelector("#loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  console.log({
    email,
    password
  });

  alert("Login demo submitted");
});