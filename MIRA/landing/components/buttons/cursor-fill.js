/* UI Vault components/buttons/button-001: Cursor Fill interaction. */
document.querySelectorAll('[data-cursor-fill]').forEach((button) => {
  const bubble = button.querySelector('.cursor-bubble');
  button.addEventListener('mouseenter', (event) => {
    const rect = button.getBoundingClientRect();
    bubble.style.left = `${event.clientX - rect.left}px`;
    bubble.style.top = `${event.clientY - rect.top}px`;
  });
});
