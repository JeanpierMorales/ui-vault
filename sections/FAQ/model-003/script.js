(() => {
  document.documentElement.classList.add('js');
  const root = document.querySelector('.faq');
  const input = root.querySelector('#q');
  const items = [...root.querySelectorAll('.list li')];
  const filters = [...root.querySelectorAll('.filters button')];
  const count = root.querySelector('.count');
  const empty = root.querySelector('.empty');
  const term = root.querySelector('.term');
  let topic = 'all';

  const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  items.forEach((li) => {
    li._q = li.querySelector('.q');
    li._p = li.querySelector('.a p');
    li._qText = li._q.textContent;
    li._pText = li._p.textContent;
  });

  // Wrap matches in <mark>, comparing accent-insensitively but keeping the original text.
  const highlight = (el, text, needle) => {
    el.textContent = '';
    if (!needle) { el.textContent = text; return; }
    const hay = fold(text);
    let i = 0, at;
    while ((at = hay.indexOf(needle, i)) !== -1) {
      el.append(text.slice(i, at));
      const m = document.createElement('mark');
      m.textContent = text.slice(at, at + needle.length);
      el.append(m);
      i = at + needle.length;
    }
    el.append(text.slice(i));
  };

  const render = () => {
    const needle = fold(input.value.trim());
    let shown = 0;
    items.forEach((li) => {
      const inTopic = topic === 'all' || li.dataset.topic === topic;
      const hit = !needle || fold(li._qText + ' ' + li._pText).includes(needle);
      const visible = inTopic && hit;
      li.hidden = !visible;
      if (visible) shown++;
      highlight(li._q, li._qText, needle);
      highlight(li._p, li._pText, needle);
      if (needle && visible && fold(li._pText).includes(needle)) li._q.setAttribute('aria-expanded', 'true');
    });
    count.textContent = shown === 1 ? '1 respuesta' : `${shown} respuestas`;
    empty.hidden = shown > 0;
    term.textContent = input.value.trim();
  };

  input.addEventListener('input', render);
  filters.forEach((b) => b.addEventListener('click', () => {
    topic = b.dataset.topic;
    filters.forEach((f) => f.setAttribute('aria-pressed', String(f === b)));
    render();
  }));
  items.forEach((li) => li._q.addEventListener('click', () => {
    li._q.setAttribute('aria-expanded', String(li._q.getAttribute('aria-expanded') !== 'true'));
  }));
  render();
})();
