import { components, categoryGroups, categoryLabel } from '../data/components.js';

const $ = (selector) => document.querySelector(selector);
const elements = {
  nav: $('#category-nav'),
  search: $('#component-search'),
  clearSearch: $('#clear-search'),
  contentGroup: $('#content-group'),
  contentTitle: $('#content-title'),
  contentCount: $('#content-count'),
  pieces: $('#pieces'),
  piecesEmpty: $('#pieces-empty'),
  libraryTotal: $('#library-total'),
  sidebar: $('#library-sidebar'),
  menuToggle: $('#menu-toggle'),
  themeToggle: $('#theme-toggle'),
};

const HEIGHTS = {
  typography: 560, icons: 520, colors: 720,
  buttons: 340, cards: 460, 'book-cards': 460, loaders: 220, forms: 640, dashboard: 420,
  navbar: 140, features: 720, pricing: 720, process: 720, testimonials: 520, skeleton: 720,
  'motion-2d': 900, 'motion-3d': 640, 'motion-effects': 720,
};

const state = {
  activeCategory: null,
  query: '',
};

const heightFor = (item) => HEIGHTS[item.category] || 460;
const makeIcon = (icon) => {
  const node = document.createElement('iconify-icon');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('icon', icon);
  return node;
};

function categoryCount(categoryId) {
  return components.filter((item) => item.category === categoryId).length;
}

function activeGroups() {
  return categoryGroups
    .map((group) => ({ ...group, items: group.items.filter(([id]) => categoryCount(id) > 0) }))
    .filter((group) => group.items.length);
}

function firstAvailableCategory() {
  const groups = activeGroups();
  return groups[0]?.items[0]?.[0] || null;
}

function categoryGroupLabel(categoryId) {
  const group = categoryGroups.find((g) => g.items.some(([id]) => id === categoryId));
  return group?.label || '';
}

function matchingPieces() {
  const query = state.query.trim().toLowerCase();
  if (query) {
    return components.filter((item) =>
      [item.code, item.name, item.description, item.category, ...(item.tags || [])]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }
  if (state.activeCategory === 'all') return components;
  return components.filter((item) => item.category === state.activeCategory);
}

function renderNav() {
  elements.nav.replaceChildren();
  const groups = activeGroups();

  const overview = navButton('Toda la biblioteca', 'all', components.length);
  overview.classList.add('overview');
  elements.nav.append(overview);

  groups.forEach((group) => {
    const heading = document.createElement('p');
    heading.className = 'side-label';
    heading.textContent = group.label;
    elements.nav.append(heading);
    group.items.forEach(([id, name]) => elements.nav.append(navButton(name, id, categoryCount(id))));
  });
}

function navButton(label, categoryId, count) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = categoryId === state.activeCategory && !state.query ? 'is-active' : '';
  const text = document.createElement('span');
  text.textContent = label;
  const badge = document.createElement('span');
  badge.className = 'nav-badge';
  badge.textContent = count;
  button.append(text, badge);
  button.addEventListener('click', () => {
    state.activeCategory = categoryId;
    state.query = '';
    elements.search.value = '';
    render();
    closeSidebar();
  });
  return button;
}

function renderPieces() {
  const pieces = matchingPieces();
  const query = state.query.trim();

  if (query) {
    elements.contentGroup.textContent = 'Búsqueda';
    elements.contentTitle.textContent = `Resultados para "${query}"`;
  } else if (state.activeCategory === 'all') {
    elements.contentGroup.textContent = 'Biblioteca';
    elements.contentTitle.textContent = 'Toda la biblioteca';
  } else {
    elements.contentGroup.textContent = categoryGroupLabel(state.activeCategory);
    elements.contentTitle.textContent = categoryLabel(state.activeCategory);
  }
  elements.contentCount.textContent = `${pieces.length} ${pieces.length === 1 ? 'pieza' : 'piezas'}`;

  elements.pieces.replaceChildren(...pieces.map(renderPieceCard));
  const empty = pieces.length === 0;
  elements.piecesEmpty.hidden = !empty;
  elements.pieces.hidden = empty;
}

function renderPieceCard(item) {
  const card = document.createElement('article');
  card.className = 'piece-card';
  card.style.setProperty('--piece-height', `${heightFor(item)}px`);

  const header = document.createElement('header');
  header.className = 'piece-head';

  const meta = document.createElement('div');
  meta.className = 'piece-meta';
  const code = document.createElement('span');
  code.className = 'piece-code';
  code.textContent = item.code;
  const cat = document.createElement('span');
  cat.className = 'piece-category';
  cat.textContent = categoryLabel(item.category);
  meta.append(code, cat);

  const name = document.createElement('h2');
  name.className = 'piece-name';
  name.textContent = item.name;

  const openLink = document.createElement('a');
  openLink.className = 'piece-open';
  openLink.href = item.path;
  openLink.target = '_blank';
  openLink.rel = 'noopener';
  openLink.setAttribute('aria-label', `Abrir ${item.name} en pestaña nueva`);
  openLink.append(makeIcon('ph:arrow-square-out'));

  const headText = document.createElement('div');
  headText.className = 'piece-head-text';
  headText.append(meta, name);
  header.append(headText, openLink);

  const frame = document.createElement('iframe');
  frame.className = 'piece-frame';
  frame.src = item.path;
  frame.title = `Vista previa de ${item.name}`;
  frame.loading = 'lazy';
  frame.setAttribute('allow', 'fullscreen');

  card.append(header, frame);
  return card;
}

function render() {
  renderNav();
  renderPieces();
}

function closeSidebar() {
  elements.sidebar.classList.remove('is-open');
  elements.menuToggle.setAttribute('aria-expanded', 'false');
}

function initTheme() {
  if (localStorage.getItem('ui-vault-theme') === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  }
}

function bindEvents() {
  elements.search.addEventListener('input', () => {
    state.query = elements.search.value;
    render();
  });
  elements.clearSearch.addEventListener('click', () => {
    state.query = '';
    elements.search.value = '';
    render();
  });
  elements.menuToggle.addEventListener('click', () => {
    const open = elements.sidebar.classList.toggle('is-open');
    elements.menuToggle.setAttribute('aria-expanded', String(open));
  });
  elements.themeToggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    elements.themeToggle.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    localStorage.setItem('ui-vault-theme', dark ? 'dark' : 'light');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      elements.search.focus();
    }
  });
}

initTheme();
state.activeCategory = firstAvailableCategory();
elements.libraryTotal.textContent = `${components.length} piezas`;
bindEvents();
render();
