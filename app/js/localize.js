const translations = new Map([
  ['Página sin título', 'Untitled page'], ['Vista individual', 'Individual preview'], ['Añadir', 'Add'], ['Añadir ', 'Add '],
  ['Empieza con una pieza real', 'Start with a real piece'], ['Selecciona un bloque', 'Select a block'], ['Aquí ajustarás el espacio del bloque y su orden dentro de la página.', 'Adjust the block space and its order on the page here.'],
  ['Altura del lienzo', 'Canvas height'], ['Fondo del contenedor', 'Container background'], ['Papel', 'Paper'], ['Tinta', 'Ink'], ['Gris cálido', 'Warm gray'],
  ['Duplicar bloque', 'Duplicate block'], ['Eliminar', 'Delete'], ['Subir bloque', 'Move block up'], ['Bajar bloque', 'Move block down'],
  ['Proyecto exportado. Ya puedes crear su carpeta preview.', 'Project exported. You can now create its preview folder.'], ['Página nueva creada', 'New page created.'],
  ['Cambiar a modo oscuro', 'Switch to dark mode'], ['Cambiar a modo claro', 'Switch to light mode'],
]);

function translateText(value) {
  if (translations.has(value)) return translations.get(value);
  const available = value.match(/^(\d+) pieza(s)? disponible(s)? · Inserta o arrastra al lienzo\.$/);
  if (available) return `${available[1]} ${available[2] ? 'pieces' : 'piece'} available · Insert or drag onto the canvas.`;
  const result = value.match(/^Resultados para “(.+)”$/);
  if (result) return `Results for “${result[1]}”`;
  if (/^\d+ piezas$/.test(value)) return value.replace('piezas', 'pieces');
  if (value === 'Todo el archivo') return 'Entire library';
  if (value === 'No hay piezas en esta búsqueda.') return 'No pieces match this search.';
  if (/^\d+ bloque(s)?$/.test(value)) return value.replace(/bloque(s)?$/, 'block$1');
  if (value.startsWith('Añadir ')) return `Add ${value.slice(7)}`;
  return value;
}

function localize(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const value = node.nodeValue.trim();
    const translation = translateText(value);
    if (translation !== value) node.nodeValue = node.nodeValue.replace(value, translation);
  });
  root.querySelectorAll?.('[aria-label],[title]').forEach((element) => {
    ['aria-label', 'title'].forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (!current) return;
      const translation = translateText(current);
      if (translation !== current) element.setAttribute(attribute, translation);
    });
  });
}

new MutationObserver(() => localize()).observe(document.body, { childList: true, subtree: true, characterData: true });
localize();
