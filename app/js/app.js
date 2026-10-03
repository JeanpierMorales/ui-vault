import { components, categoryGroups, categoryLabel } from '../data/components.js?v=20261003c';

const $ = (selector) => document.querySelector(selector);
const elements = {
  shell: $('#vault-shell'),
  tree: $('#library-tree'),
  treeEmpty: $('#tree-empty'),
  search: $('#component-search'),
  clearSearch: $('#clear-search'),
  libraryTotal: $('#library-total'),
  sidebar: $('#library-sidebar'),
  scrim: $('#sidebar-scrim'),
  railToggle: $('#rail-toggle'),
  themeToggle: $('#theme-toggle'),
  stageGroup: $('#stage-group'),
  stageCategory: $('#stage-category'),
  stageCode: $('#stage-code'),
  stageName: $('#stage-name'),
  stageDesc: $('#stage-desc'),
  canvas: $('#stage-canvas'),
  frames: [...document.querySelectorAll('.piece-frame')],
  loading: $('#frame-loading'),
  deviceButtons: [...document.querySelectorAll('[data-device]')].filter((node) => node.tagName === 'BUTTON'),
  backdropToggle: $('#backdrop-toggle'),
  favoriteToggle: $('#favorite-toggle'),
  reload: $('#reload-piece'),
  copyLink: $('#copy-link'),
  open: $('#open-piece'),
  focusToggle: $('#focus-toggle'),
  prev: $('#prev-piece'),
  next: $('#next-piece'),
  prevName: $('#prev-name'),
  nextName: $('#next-name'),
  position: $('#stage-position'),
  hud: $('#focus-hud'),
  hudCode: $('#hud-code'),
  hudName: $('#hud-name'),
  hudCount: $('#hud-count'),
  toast: $('#toast'),
};

const BACKDROPS = ['paper', 'dark', 'grid'];
const MOBILE_QUERY = window.matchMedia('(max-width: 900px)');

// localStorage can be missing or throw (private mode, blocked storage); the vault must still work.
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(`ui-vault:${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`ui-vault:${key}`, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
};

const state = {
  current: null,
  query: '',
  open: new Set(store.get('open', [])),
  favorites: new Set(store.get('favorites', [])),
  device: store.get('device', 'desktop'),
  backdrop: store.get('backdrop', 'paper'),
  railCollapsed: store.get('rail-collapsed', false),
  focus: false,
  loadToken: 0,
};

/* ---------- Library order ---------- */

const byCode = (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true });

// Every category in sidebar order, each with its pieces; "next" walks this list end to end.
const library = categoryGroups
  .map((group) => ({
    label: group.label,
    categories: group.items
      .map(([id, label]) => ({ id, label, pieces: components.filter((item) => item.category === id).sort(byCode) }))
      .filter((category) => category.pieces.length),
  }))
  .filter((group) => group.categories.length);

const ordered = library.flatMap((group) => group.categories.flatMap((category) => category.pieces));
const groupOf = (item) => library.find((group) => group.categories.some((category) => category.id === item.category));
const findByCode = (code) => ordered.find((item) => item.code.toLowerCase() === String(code || '').toLowerCase());

function matches(item, query) {
  if (!query) return true;
  const haystack = [item.code, item.name, item.description, categoryLabel(item.category), ...(item.tags || [])]
    .join(' ')
    .toLowerCase();
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

const normalizedQuery = () => state.query.trim().toLowerCase();

// While searching, prev/next only walks the results.
function sequence() {
  const query = normalizedQuery();
  if (!query) return ordered;
  const results = ordered.filter((item) => matches(item, query));
  return results.length ? results : ordered;
}

/* ---------- Sidebar tree ---------- */

const makeIcon = (icon) => {
  const node = document.createElement('iconify-icon');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('icon', icon);
  return node;
};

function pieceButton(item) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tree-piece';
  button.dataset.code = item.code;
  if (state.current === item) {
    button.classList.add('is-active');
    button.setAttribute('aria-current', 'true');
  }
  const code = document.createElement('span');
  code.className = 'tree-code';
  code.textContent = item.code;
  const name = document.createElement('span');
  name.className = 'tree-name';
  name.textContent = item.name;
  button.append(code, name);
  if (state.favorites.has(item.code)) button.append(makeIcon('ph:star-fill'));
  button.addEventListener('click', () => {
    show(item);
    if (MOBILE_QUERY.matches) closeDrawer();
  });
  return button;
}

function categoryBlock(id, label, pieces, { forceOpen = false } = {}) {
  const block = document.createElement('div');
  block.className = 'tree-category';
  const isOpen = forceOpen || state.open.has(id);
  const hasCurrent = pieces.includes(state.current);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'tree-toggle';
  if (hasCurrent) toggle.classList.add('has-current');
  toggle.setAttribute('aria-expanded', String(isOpen));
  const caret = makeIcon('ph:caret-right');
  caret.classList.add('tree-caret');
  const text = document.createElement('span');
  text.className = 'tree-label';
  text.textContent = label;
  const badge = document.createElement('span');
  badge.className = 'nav-badge';
  badge.textContent = pieces.length;
  toggle.append(caret, text, badge);
  toggle.addEventListener('click', () => {
    if (state.open.has(id)) state.open.delete(id);
    else state.open.add(id);
    store.set('open', [...state.open]);
    renderTree();
  });

  const list = document.createElement('div');
  list.className = 'tree-pieces';
  list.hidden = !isOpen;
  if (isOpen) list.append(...pieces.map(pieceButton));

  block.append(toggle, list);
  return block;
}

function renderTree() {
  const query = normalizedQuery();
  const nodes = [];
  let total = 0;

  const favorites = ordered.filter((item) => state.favorites.has(item.code) && matches(item, query));
  if (favorites.length) {
    nodes.push(sideLabel('Favoritos'));
    const block = categoryBlock('__favorites', 'Mis favoritos', favorites, { forceOpen: true });
    block.classList.add('is-favorites');
    nodes.push(block);
  }

  library.forEach((group) => {
    const blocks = group.categories
      .map((category) => {
        const pieces = category.pieces.filter((item) => matches(item, query));
        total += pieces.length;
        return pieces.length ? categoryBlock(category.id, category.label, pieces, { forceOpen: Boolean(query) }) : null;
      })
      .filter(Boolean);
    if (blocks.length) nodes.push(sideLabel(group.label), ...blocks);
  });

  elements.tree.replaceChildren(...nodes);
  elements.treeEmpty.hidden = total > 0;
  elements.tree.hidden = total === 0;
}

function sideLabel(text) {
  const label = document.createElement('p');
  label.className = 'side-label';
  label.textContent = text;
  return label;
}

function revealActiveInTree() {
  const active = elements.tree.querySelector('.tree-category:not(.is-favorites) .tree-piece.is-active');
  active?.scrollIntoView({ block: 'nearest' });
}

/* ---------- Stage ---------- */

function show(item, { fromHash = false } = {}) {
  if (!item) return;
  const changed = state.current !== item;
  state.current = item;
  if (!state.open.has(item.category)) {
    state.open.add(item.category);
    store.set('open', [...state.open]);
  }
  store.set('last', item.code);
  if (!fromHash && location.hash.slice(1) !== item.code) history.replaceState(null, '', `#${item.code}`);

  const group = groupOf(item);
  elements.stageGroup.textContent = group?.label || item.group;
  elements.stageCategory.textContent = categoryLabel(item.category);
  elements.stageCode.textContent = item.code;
  elements.stageName.textContent = item.name;
  elements.stageDesc.textContent = item.description || '';
  elements.stageDesc.title = item.description || '';
  elements.open.href = item.path;
  document.title = `${item.name} · UI Vault`;

  renderStepper();
  renderFavorite();
  renderTree();
  revealActiveInTree();
  if (changed) loadFrame(item.path);
}

function renderStepper() {
  const list = sequence();
  const index = list.indexOf(state.current);
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  elements.prevName.textContent = prev ? `${prev.code} · ${prev.name}` : '';
  elements.nextName.textContent = next ? `${next.code} · ${next.name}` : '';

  const inCategory = ordered.filter((item) => item.category === state.current.category);
  const categoryIndex = inCategory.indexOf(state.current) + 1;
  const label = normalizedQuery()
    ? `${index + 1} / ${list.length} resultados`
    : `${categoryLabel(state.current.category)} · ${categoryIndex} / ${inCategory.length}`;
  elements.position.textContent = label;
  elements.hudCode.textContent = state.current.code;
  elements.hudName.textContent = state.current.name;
  elements.hudCount.textContent = label;
}

function step(delta) {
  const list = sequence();
  if (!list.length) return;
  const index = list.indexOf(state.current);
  show(list[(index + delta + list.length) % list.length]);
  flashHud();
}

// Two stacked iframes: the next piece loads behind the current one and fades in once ready,
// so moving between pieces never flashes an empty stage.
function loadFrame(path) {
  const token = ++state.loadToken;
  const [current, incoming] = elements.frames[0].classList.contains('is-current')
    ? elements.frames
    : [elements.frames[1], elements.frames[0]];

  const loadingTimer = setTimeout(() => {
    if (token === state.loadToken) elements.loading.hidden = false;
  }, 180);

  let settled = false;
  const reveal = () => {
    if (settled || token !== state.loadToken) return;
    settled = true;
    clearTimeout(loadingTimer);
    clearTimeout(fallback);
    elements.loading.hidden = true;
    incoming.classList.add('is-current');
    incoming.removeAttribute('aria-hidden');
    incoming.removeAttribute('tabindex');
    incoming.title = `Vista de ${state.current.name}`;
    current.classList.remove('is-current');
    current.setAttribute('aria-hidden', 'true');
    current.setAttribute('tabindex', '-1');
    bridgeKeys(incoming);
    // Focus left inside the outgoing piece would strand the keyboard once it unloads.
    if (document.activeElement === current) {
      current.blur();
      window.focus();
    }
    // Unload the old piece after the fade so heavy canvases/3D stop running.
    // Skip if another navigation already reused this frame for the next piece.
    setTimeout(() => {
      if (token === state.loadToken && !current.classList.contains('is-current')) current.src = 'about:blank';
    }, 260);
  };
  // Heavy pieces may never fire load quickly; show whatever has rendered after a while.
  const fallback = setTimeout(reveal, 5000);

  incoming.onload = () => {
    if (incoming.src.endsWith('about:blank')) return;
    reveal();
  };
  incoming.src = path;
}

function reloadCurrent() {
  if (!state.current) return;
  const path = state.current.path;
  const frame = elements.frames.find((node) => node.classList.contains('is-current'));
  state.loadToken++;
  frame.onload = () => bridgeKeys(frame);
  frame.src = 'about:blank';
  requestAnimationFrame(() => {
    frame.src = path;
  });
  showToast('Pieza reiniciada');
}

/* ---------- Stage options ---------- */

function applyDevice(device) {
  state.device = device;
  store.set('device', device);
  elements.canvas.dataset.device = device;
  elements.deviceButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.device === device)));
}

function applyBackdrop(backdrop) {
  state.backdrop = backdrop;
  store.set('backdrop', backdrop);
  elements.canvas.dataset.backdrop = backdrop;
}

function renderFavorite() {
  const on = state.favorites.has(state.current?.code);
  elements.favoriteToggle.setAttribute('aria-pressed', String(on));
  elements.favoriteToggle.setAttribute('aria-label', on ? 'Quitar de favoritos' : 'Marcar como favorito');
  elements.favoriteToggle.querySelector('iconify-icon').setAttribute('icon', on ? 'ph:star-fill' : 'ph:star');
}

function toggleFavorite() {
  const code = state.current?.code;
  if (!code) return;
  const added = !state.favorites.has(code);
  if (added) state.favorites.add(code);
  else state.favorites.delete(code);
  store.set('favorites', [...state.favorites]);
  renderFavorite();
  renderTree();
  showToast(added ? 'Añadida a favoritos' : 'Quitada de favoritos');
}

function applyRail(collapsed) {
  state.railCollapsed = collapsed;
  store.set('rail-collapsed', collapsed);
  elements.shell.classList.toggle('rail-collapsed', collapsed);
  syncRailButton();
}

function syncRailButton() {
  const open = MOBILE_QUERY.matches ? elements.sidebar.classList.contains('is-open') : !state.railCollapsed;
  elements.railToggle.setAttribute('aria-expanded', String(open));
  elements.railToggle.setAttribute('aria-label', open ? 'Ocultar biblioteca' : 'Mostrar biblioteca');
}

function openDrawer() {
  elements.sidebar.classList.add('is-open');
  elements.scrim.hidden = false;
  syncRailButton();
}

function closeDrawer() {
  elements.sidebar.classList.remove('is-open');
  elements.scrim.hidden = true;
  syncRailButton();
}

/* ---------- Focus mode ---------- */

let hudTimer;
function flashHud() {
  if (!state.focus) return;
  elements.hud.classList.add('is-visible');
  clearTimeout(hudTimer);
  hudTimer = setTimeout(() => elements.hud.classList.remove('is-visible'), 2200);
}

function setFocus(on) {
  if (state.focus === on) return;
  state.focus = on;
  elements.shell.classList.toggle('is-focus', on);
  elements.hud.setAttribute('aria-hidden', String(!on));
  if (on) {
    document.documentElement.requestFullscreen?.().catch(() => {});
    flashHud();
  } else {
    elements.hud.classList.remove('is-visible');
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }
}

/* ---------- Keyboard ---------- */

const isEditable = (target) =>
  target instanceof Element && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

function handleKey(event, { fromFrame = false } = {}) {
  if (event.defaultPrevented || event.altKey) return;
  const key = event.key;

  if ((event.metaKey || event.ctrlKey) && key.toLowerCase() === 'k') {
    event.preventDefault();
    focusSearch();
    return;
  }
  if (event.metaKey || event.ctrlKey) return;

  if (key === 'Escape') {
    if (state.focus) setFocus(false);
    else if (elements.sidebar.classList.contains('is-open')) closeDrawer();
    return;
  }
  if (isEditable(event.target)) return;
  // Inside a piece, leave keys alone when one of its own controls has focus.
  if (fromFrame) {
    const doc = event.target.ownerDocument;
    if (event.target !== doc.body && event.target !== doc.documentElement) return;
  }

  const actions = {
    ArrowRight: () => step(1),
    ArrowLeft: () => step(-1),
    j: () => step(1),
    k: () => step(-1),
    f: () => setFocus(!state.focus),
    b: () => applyBackdrop(BACKDROPS[(BACKDROPS.indexOf(state.backdrop) + 1) % BACKDROPS.length]),
    s: toggleFavorite,
    r: reloadCurrent,
    '1': () => applyDevice('desktop'),
    '2': () => applyDevice('tablet'),
    '3': () => applyDevice('mobile'),
    '/': focusSearch,
  };
  const action = actions[key.length === 1 ? key.toLowerCase() : key];
  if (!action) return;
  event.preventDefault();
  action();
}

// Pieces are same-origin when served locally, so arrow keys keep working after clicking into one.
// Opened from file:// the frame is opaque and this silently does nothing.
function bridgeKeys(frame) {
  try {
    const win = frame.contentWindow;
    if (!win || win.__vaultKeys) return;
    win.__vaultKeys = true;
    win.addEventListener('keydown', (event) => handleKey(event, { fromFrame: true }));
    win.addEventListener('mousemove', flashHud, { passive: true });
  } catch {
    /* cross-origin */
  }
}

function focusSearch() {
  if (state.focus) setFocus(false);
  if (MOBILE_QUERY.matches) openDrawer();
  else if (state.railCollapsed) applyRail(false);
  elements.search.focus();
  elements.search.select();
}

/* ---------- Misc ---------- */

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('is-visible'), 2000);
}

function initTheme() {
  const saved = store.get('theme', null) || localStorageValue('ui-vault-theme');
  if (saved === 'dark') document.documentElement.dataset.theme = 'dark';
}

// Theme was stored raw under the old key before the vault moved to namespaced JSON keys.
function localStorageValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function bindEvents() {
  elements.search.addEventListener('input', () => {
    state.query = elements.search.value;
    renderTree();
    renderStepper();
  });
  elements.search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const first = elements.tree.querySelector('.tree-category:not(.is-favorites) .tree-piece');
      const item = findByCode(first?.dataset.code);
      if (item) {
        show(item);
        elements.search.blur();
        if (MOBILE_QUERY.matches) closeDrawer();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      elements.tree.querySelector('.tree-piece')?.focus();
    } else if (event.key === 'Escape') {
      if (elements.search.value) {
        elements.search.value = '';
        state.query = '';
        renderTree();
        renderStepper();
      } else {
        elements.search.blur();
      }
    }
  });
  elements.clearSearch.addEventListener('click', () => {
    state.query = '';
    elements.search.value = '';
    renderTree();
    renderStepper();
  });

  // Up/down moves through the visible tree like a list.
  elements.tree.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = [...elements.tree.querySelectorAll('.tree-toggle, .tree-piece')];
    const index = items.indexOf(document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    event.stopPropagation();
    items[Math.max(0, Math.min(items.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus();
  });

  elements.railToggle.addEventListener('click', () => {
    if (MOBILE_QUERY.matches) {
      if (elements.sidebar.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    } else {
      applyRail(!state.railCollapsed);
    }
  });
  elements.scrim.addEventListener('click', closeDrawer);
  MOBILE_QUERY.addEventListener('change', () => {
    closeDrawer();
    syncRailButton();
  });

  elements.themeToggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    elements.themeToggle.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    store.set('theme', dark ? 'dark' : 'light');
  });

  elements.deviceButtons.forEach((button) => button.addEventListener('click', () => applyDevice(button.dataset.device)));
  elements.backdropToggle.addEventListener('click', () =>
    applyBackdrop(BACKDROPS[(BACKDROPS.indexOf(state.backdrop) + 1) % BACKDROPS.length])
  );
  elements.favoriteToggle.addEventListener('click', toggleFavorite);
  elements.reload.addEventListener('click', reloadCurrent);
  elements.copyLink.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast('Enlace copiado');
    } catch {
      showToast('No se pudo copiar el enlace');
    }
  });
  elements.focusToggle.addEventListener('click', () => setFocus(true));
  elements.prev.addEventListener('click', () => step(-1));
  elements.next.addEventListener('click', () => step(1));

  elements.hud.addEventListener('click', (event) => {
    const action = event.target.closest('[data-hud]')?.dataset.hud;
    if (action === 'prev') step(-1);
    if (action === 'next') step(1);
    if (action === 'exit') setFocus(false);
  });
  document.addEventListener('mousemove', flashHud, { passive: true });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && state.focus) setFocus(false);
  });

  document.addEventListener('keydown', (event) => handleKey(event));
  window.addEventListener('hashchange', () => {
    const item = findByCode(location.hash.slice(1));
    if (item && item !== state.current) show(item, { fromHash: true });
  });
}

initTheme();
elements.libraryTotal.textContent = `${ordered.length} piezas`;
applyDevice(state.device);
applyBackdrop(BACKDROPS.includes(state.backdrop) ? state.backdrop : 'paper');
elements.shell.classList.toggle('rail-collapsed', state.railCollapsed);
syncRailButton();
bindEvents();
show(findByCode(location.hash.slice(1)) || findByCode(store.get('last', null)) || ordered[0], { fromHash: true });
