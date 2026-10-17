(() => {
  document.documentElement.classList.add('js');
  const root = document.querySelector('.faq');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panel = root.querySelector('.panel');
  const tablist = root.querySelector('.tabs');
  const imgs = [...panel.querySelectorAll('.photo img')];
  const copy = panel.querySelector('.copy');
  const narrow = matchMedia('(max-width: 860px)');
  const data = [
    ['Incluye limpieza y lubricado de transmisión, ajuste de frenos y cambios, centrado de ruedas y revisión de rodajes. Te mandamos fotos por WhatsApp si encontramos algo gastado antes de cambiarlo.', 'S/ 120', '24 horas'],
    ['Sí, trabajamos motores Bafang y Shimano Steps. El diagnóstico cuesta S/ 60 y se descuenta del arreglo si lo hacemos nosotros.', 'Desde S/ 60', '2 a 3 días'],
    ['Medimos tu postura en rodillo y ajustamos altura y retroceso del sillín, potencia y calas. Sales con un informe de tus medidas para tu próxima bici.', 'S/ 250', '90 minutos'],
    ['Pinchazos, cadenas y ajustes rápidos se hacen al momento. Hay café de la casa y una banca frente al malecón mientras esperas.', 'Desde S/ 25', '30 minutos'],
    ['Recogemos y devolvemos en Barranco, Miraflores y Chorrillos. Coordinamos la hora por WhatsApp el mismo día.', 'S/ 20 ida y vuelta', 'Mismo día'],
    ['La desarmamos, protegemos el cuadro y la embalamos en caja rígida para avión. Al volver la armamos y la dejamos lista para rodar.', 'S/ 90 + S/ 70 armado', '1 día'],
  ];
  let current = 0;

  const place = () => {
    // On narrow screens the answer sits right under its question, like an accordion.
    if (narrow.matches) tabs[current].after(panel);
    else if (panel.parentElement === tablist) tablist.after(panel);
  };

  const select = (i, focus) => {
    current = i;
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tabs[i].focus();
    panel.setAttribute('aria-labelledby', tabs[i].id);
    imgs.forEach((img, k) => img.classList.toggle('is-on', k === i));
    const [a, price, time] = data[i];
    panel.querySelector('.p-q').textContent = tabs[i].lastChild.textContent.trim();
    panel.querySelector('.p-a').textContent = a;
    panel.querySelector('.p-price').textContent = price;
    panel.querySelector('.p-time').textContent = time;
    copy.classList.remove('swap'); void copy.offsetWidth; copy.classList.add('swap');
    place();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); select(e.key === 'Home' ? 0 : tabs.length - 1, true); }
    });
  });
  narrow.addEventListener('change', place);
  select(0);
})();
