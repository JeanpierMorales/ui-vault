const body = document.body;
const statusText = document.querySelector(".loading-status");

// Mantiene el skeleton puro en blanco y negro durante 10 segundos.
setTimeout(() => {
  body.classList.add("loaded-tone");

  statusText.innerHTML = `
    <span class="status-dot"></span>
    Loading components
  `;
}, 10000);
