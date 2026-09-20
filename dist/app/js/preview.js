import { components } from '../data/components.js';

const title = document.querySelector('#preview-title');
const page = document.querySelector('#published-page');
const frameSource = (block) => {
  if (!block.selector) return block.sourcePath || components.find(({ id }) => id === block.componentId)?.path;
  return `./app/isolate.html?source=${encodeURIComponent(`../${block.sourcePath.replace(/^\.\//, '')}`)}&selector=${encodeURIComponent(block.selector)}`;
};

try {
  const project = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(location.hash.slice(1))))));
  title.textContent = project.title || 'Página sin título';
  document.title = `${title.textContent} — UI Vault`;
  if (!project.blocks?.length) page.innerHTML = '<section class="preview-empty"><h1>Esta página todavía no tiene bloques.</h1><p>Vuelve al constructor para crearla.</p></section>';
  else project.blocks.forEach((block) => {
    const source = frameSource(block); if (!source) return;
    const section = document.createElement('section'); section.className = `published-block published-block--${block.background || 'paper'}`; section.style.setProperty('--published-height', `${block.height || 430}px`);
    const frame = document.createElement('iframe'); frame.src = source; frame.title = block.name || 'Componente UI Vault'; frame.loading = 'lazy'; frame.setAttribute('allow', 'fullscreen'); section.append(frame); page.append(section);
  });
} catch {
  title.textContent = 'Preview no disponible';
  page.innerHTML = '<section class="preview-empty"><h1>No se pudo leer este proyecto.</h1><p>Ábrelo desde “Ver publicación” en UI Vault.</p></section>';
}
