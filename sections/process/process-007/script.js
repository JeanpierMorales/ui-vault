(() => {
  document.documentElement.classList.add('js');
  const root = document.querySelector('.stages');
  const rows = [...root.querySelectorAll('.row')];
  const btns = rows.map((r) => r.querySelector('.row-btn'));
  const imgs = [...root.querySelectorAll('.photo img')];
  const capNum = root.querySelector('.cap-num');
  const capText = root.querySelector('.cap-text');
  const signBtn = root.querySelector('.btn-sign');
  const captions = [
    'Solo portal.cliente.pe, nada fuera del dominio firmado',
    'Puertos 80 y 443, a la velocidad pactada',
    'Versiones y controles visibles, sin abrir datos',
    'Cada hallazgo con impacto y evidencia',
    'Bloqueado hasta recibir la carta firmada',
  ];
  const signedCaption = 'Autorizado: validación controlada';

  const show = (i) => {
    imgs.forEach((img, k) => img.classList.toggle('is-on', k === i));
    capNum.textContent = String(i + 1).padStart(2, '0');
    capText.textContent = i === 4 && root.classList.contains('is-signed') ? signedCaption : captions[i];
  };

  const open = (i) => {
    rows.forEach((r, k) => {
      const on = k === i;
      r.classList.toggle('is-open', on);
      btns[k].setAttribute('aria-expanded', String(on));
    });
    show(i);
  };

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => open(i));
    btn.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (step) {
        e.preventDefault();
        btns[(i + step + btns.length) % btns.length].focus();
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        btns[e.key === 'Home' ? 0 : btns.length - 1].focus();
      }
    });
  });

  signBtn.addEventListener('click', () => {
    const signed = !root.classList.contains('is-signed');
    root.classList.toggle('is-signed', signed);
    signBtn.setAttribute('aria-pressed', String(signed));
    signBtn.textContent = signed ? 'Carta registrada' : 'Registrar carta firmada';
    root.querySelector('.row-locked .when-text').textContent = signed ? 'Autorizada' : 'Con firma';
    show(4);
  });
})();
