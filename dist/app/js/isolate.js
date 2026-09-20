const params = new URLSearchParams(location.search);
const source = params.get('source');
const selector = params.get('selector');
const frame = document.querySelector('#source-frame');

if (!source || !selector) {
  document.body.textContent = 'No se indicó un componente para aislar.';
} else {
  frame.src = source;
  frame.addEventListener('load', () => {
    try {
      const document = frame.contentDocument;
      const target = document.querySelector(selector);
      if (!target) throw new Error('Selector no encontrado');

      let current = target;
      while (current.parentElement && current.parentElement !== document.body) {
        const parent = current.parentElement;
        [...parent.children].forEach((sibling) => {
          if (sibling !== current) sibling.style.setProperty('display', 'none', 'important');
        });
        current = parent;
      }
      [...document.body.children].forEach((sibling) => {
        if (sibling !== current) sibling.style.setProperty('display', 'none', 'important');
      });
      current.style.setProperty('display', 'grid', 'important');
      current.style.setProperty('place-items', 'center', 'important');
      current.style.setProperty('width', '100%', 'important');
      current.style.setProperty('min-height', '100%', 'important');

      const style = document.createElement('style');
      style.textContent = `
        html, body { min-width: 0 !important; min-height: 100% !important; margin: 0 !important; overflow: auto !important; }
        body { display: grid !important; place-items: center !important; padding: 20px !important; background: transparent !important; }
        body > * { max-width: 100% !important; }
        ${selector} { max-width: 100% !important; margin-inline: auto !important; }
      `;
      document.head.append(style);
    } catch (error) {
      document.body.textContent = 'No se pudo aislar esta pieza.';
    }
  }, { once: true });
}
