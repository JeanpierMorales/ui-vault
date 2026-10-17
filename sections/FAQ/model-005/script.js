(() => {
  document.documentElement.classList.add('js');
  const root = document.querySelector('.faq');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const imgs = [...root.querySelectorAll('.photos img')];
  const qa = root.querySelector('.qa');
  const qEl = qa.querySelector('.q');
  const aEl = qa.querySelector('.a');
  const data = [
    ['¿Necesito saber cocinar?', 'No. Los grupos de iniciación empiezan por cómo sostener el cuchillo y cortar una cebolla. Somos máximo 10 personas por clase, así que el chef pasa por tu tabla varias veces.'],
    ['¿Qué incluye la clase de ceviche?', 'Tres horas con pescado comprado esa misma mañana en el terminal de Chorrillos. Preparas leche de tigre, ceviche clásico y causa, y te llevas las recetas impresas. Cuesta S/ 180.'],
    ['¿Tengo que llevar algo?', 'Solo ropa cómoda y zapatos cerrados. Delantal, cuchillos e insumos los ponemos nosotros, y al final comes lo que cocinaste.'],
    ['¿Y si soy vegetariana o celíaco?', 'Avísanos al reservar y adaptamos el menú sin costo. Cocinamos los platos sin gluten en una mesa aparte.'],
    ['¿Hay clases para empresas?', 'Sí, desde 8 personas, de lunes a jueves, con cena incluida en nuestra mesa larga. Te mandamos la propuesta en un día hábil.'],
    ['¿Si no puedo ir, pierdo la clase?', 'Puedes moverla gratis hasta 48 horas antes. Después de eso puedes enviar a otra persona en tu lugar sin pagar nada extra.'],
  ];
  let i = 0;

  const show = (n, focus) => {
    i = (n + data.length) % data.length;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    if (focus) tabs[i].focus();
    imgs.forEach((img, k) => img.classList.toggle('is-on', k === i));
    [qEl.textContent, aEl.textContent] = data[i];
    qa.classList.remove('swap'); void qa.offsetWidth; qa.classList.add('swap');
  };

  tabs.forEach((t, k) => {
    t.addEventListener('click', () => show(k));
    t.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) { e.preventDefault(); show(k + step, true); }
    });
  });
  root.querySelectorAll('.arrow').forEach((b) => b.addEventListener('click', () => show(i + Number(b.dataset.step))));

  // Horizontal swipe on touch screens.
  let x0 = null;
  root.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  root.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
  });
  show(0);
})();
