import { components, categoryGroups, categoryLabel } from '../data/components.js';

const state = { category: 'all', query: '', view: 'grid', selected: null, sourceType: 'html' };
const $ = (selector) => document.querySelector(selector);
const elements = {
  catalog: $('#catalog'), detail: $('#detail'), gallery: $('#gallery'), empty: $('#empty-state'),
  search: $('#global-search'), nav: $('#category-nav'), filters: $('#filter-line'), title: $('#page-title'),
  path: $('#page-path'), result: $('#result-note'), componentCount: $('#component-count'), categoryCount: $('#category-count'),
  preview: $('#preview-stage'), detailPath: $('#detail-path'), detailTitle: $('#detail-title'), detailDescription: $('#detail-description'), detailId: $('#detail-id'),
  sourceTabs: $('#source-tabs'), sourceFile: $('#source-file'), sourceCode: $('#source-code'), toast: $('#toast'), sidebar: $('#sidebar'),
};

const humanize = (value) => categoryLabel(value) || value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const countText = (count) => `${count} componente${count === 1 ? '' : 's'}`;
const componentDirectory = (component) => component.path.slice(0, component.path.lastIndexOf('/') + 1);
const sourcePath = (component, type) => component.sources?.[type] ? `${componentDirectory(component)}${component.sources[type]}` : null;
const toast = (message) => {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => elements.toast.classList.remove('is-visible'), 2200);
};

function componentMatches(component) {
  const haystack = [component.name, component.category, component.group, component.description, ...(component.tags || [])].join(' ').toLocaleLowerCase();
  return (state.category === 'all' || component.category === state.category) && haystack.includes(state.query.toLocaleLowerCase().trim());
}

function getVisibleComponents() { return components.filter(componentMatches); }

function getGroups() {
  const known = new Set(categoryGroups.flatMap((group) => group.items.map(([id]) => id)));
  const extras = [...new Set(components.map(({ category }) => category).filter((category) => !known.has(category)))];
  const populated = categoryGroups
    .map((group) => ({ ...group, items: group.items.filter(([id]) => components.some((component) => component.category === id)) }))
    .filter((group) => group.items.length);
  return extras.length ? [...populated, { label: 'Other', items: extras.map((category) => [category, humanize(category)]) }] : populated;
}

function makeButton(label, className, handler, active = false) {
  const button = document.createElement('button');
  button.type = 'button'; button.textContent = label; button.className = className;
  if (active) button.classList.add('is-active');
  button.addEventListener('click', handler);
  return button;
}

function setCategory(category) {
  state.category = category; state.query = '';
  elements.search.value = '';
  renderCatalog();
  closeSidebar();
}

function renderNavigation() {
  elements.nav.replaceChildren();
  const allButton = makeButton('Overview', 'overview', () => setCategory('all'), state.category === 'all');
  const allCount = document.createElement('span'); allCount.textContent = String(components.length); allButton.append(allCount);
  elements.nav.append(allButton);
  getGroups().forEach((group) => {
    const label = document.createElement('p'); label.className = 'side-label'; label.textContent = group.label;
    elements.nav.append(label);
    group.items.forEach(([id, name]) => {
      const total = components.filter((component) => component.category === id).length;
      const button = makeButton(name, '', () => setCategory(id), state.category === id);
      const count = document.createElement('span'); count.textContent = String(total); button.append(count);
      elements.nav.append(button);
    });
  });
}

function renderFilters() {
  elements.filters.replaceChildren();
  const options = [['all', 'All'], ...[...new Set(components.map(({ category }) => category))].map((category) => [category, humanize(category)])];
  options.forEach(([id, label]) => elements.filters.append(makeButton(label, '', () => setCategory(id), state.category === id)));
}

function openComponent(id) {
  state.selected = components.find((component) => component.id === id) || null;
  if (!state.selected) return;
  state.sourceType = 'html';
  elements.catalog.hidden = true; elements.detail.hidden = false;
  const component = state.selected;
  elements.detailPath.textContent = `${component.group} / ${humanize(component.category)}`;
  elements.detailTitle.textContent = component.name;
  elements.detailDescription.textContent = component.description;
  elements.detailId.textContent = component.id;
  elements.preview.replaceChildren(makePreview(component, 'detail-preview'));
  renderSourceTabs();
  loadSource('html');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeDetail() {
  state.selected = null; elements.detail.hidden = true; elements.catalog.hidden = false;
  elements.preview.replaceChildren();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function makePreview(component, className = '') {
  const frame = document.createElement('iframe');
  frame.className = className; frame.src = component.path; frame.title = `Vista previa real de ${component.name}`;
  frame.loading = 'lazy'; frame.setAttribute('allow', 'fullscreen');
  return frame;
}

function copyText(text, successMessage = 'Código copiado') {
  const fallback = () => {
    const textarea = document.createElement('textarea'); textarea.value = text; textarea.style.position = 'fixed'; textarea.style.opacity = '0';
    document.body.append(textarea); textarea.select(); document.execCommand('copy'); textarea.remove(); toast(successMessage);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => toast(successMessage)).catch(fallback);
  else fallback();
}

async function copyComponentHtml(id) {
  const component = components.find((item) => item.id === id);
  if (!component) return;
  try {
    const response = await fetch(component.path);
    if (!response.ok) throw new Error('Archivo no disponible');
    copyText(await response.text(), 'HTML original copiado');
  } catch { toast('No se pudo leer el archivo. Abre el vault desde un servidor local.'); }
}

function renderCard(component) {
  const card = document.createElement('article'); card.className = `component-card component-card--${component.category}`;
  const preview = document.createElement('div'); preview.className = 'card-preview'; preview.append(makePreview(component));
  const body = document.createElement('footer'); body.className = 'card-body';
  const meta = document.createElement('div'); meta.className = 'card-meta';
  const category = document.createElement('p'); category.textContent = `${humanize(component.category)} · ${component.id}`;
  const title = document.createElement('h2'); title.textContent = component.name;
  meta.append(category, title);
  const actions = document.createElement('div'); actions.className = 'card-actions';
  actions.append(makeButton('Abrir', '', () => openComponent(component.id)), makeButton('Copiar', '', () => copyComponentHtml(component.id)));
  body.append(meta, actions); card.append(preview, body); return card;
}

function renderCatalog() {
  const visible = getVisibleComponents();
  const isAll = state.category === 'all';
  const title = state.query ? `Resultados para “${state.query}”` : isAll ? 'Piezas del repositorio' : humanize(state.category);
  elements.title.textContent = title;
  elements.path.textContent = state.query ? 'Búsqueda global / en todo el archivo' : isAll ? 'Índice / todo el archivo' : `Categoría / ${humanize(state.category)}`;
  elements.result.textContent = `${countText(visible.length)}${state.query ? ' encontrados' : ''}`;
  elements.componentCount.textContent = countText(components.length);
  elements.categoryCount.textContent = `${new Set(components.map(({ category }) => category)).size} categorías activas`;
  elements.gallery.classList.toggle('is-list', state.view === 'list');
  elements.gallery.classList.toggle('is-filtered', !isAll || Boolean(state.query));
  elements.gallery.replaceChildren(...visible.map(renderCard));
  elements.empty.hidden = visible.length > 0;
  renderNavigation(); renderFilters();
}

async function loadSource(type) {
  if (!state.selected || !state.selected.sources?.[type]) return;
  state.sourceType = type;
  const path = sourcePath(state.selected, type);
  elements.sourceFile.textContent = path;
  elements.sourceCode.textContent = 'Cargando fuente…';
  [...elements.sourceTabs.children].forEach((tab) => tab.classList.toggle('is-active', tab.dataset.type === type));
  [...elements.sourceTabs.children].forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.type === type)));
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Archivo no encontrado');
    elements.sourceCode.textContent = await response.text();
  } catch { elements.sourceCode.textContent = 'No se pudo cargar este archivo. Ejecuta UI Vault desde un servidor local para inspeccionar y copiar fuentes.'; }
}

function renderSourceTabs() {
  elements.sourceTabs.replaceChildren();
  Object.entries(state.selected.sources || {}).forEach(([type]) => {
    const tab = makeButton(type.toUpperCase(), '', () => loadSource(type), type === state.sourceType);
    tab.dataset.type = type; tab.id = `source-tab-${type}`; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', 'source-panel'); tab.setAttribute('aria-selected', String(type === state.sourceType)); elements.sourceTabs.append(tab);
  });
}

function closeSidebar() {
  elements.sidebar.classList.remove('is-open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', 'Abrir navegación');
}

elements.search.addEventListener('input', ({ target }) => { state.query = target.value; state.category = 'all'; renderCatalog(); });
$('#grid-view').addEventListener('click', () => { state.view = 'grid'; $('#grid-view').classList.add('is-active'); $('#list-view').classList.remove('is-active'); $('#grid-view').setAttribute('aria-pressed', 'true'); $('#list-view').setAttribute('aria-pressed', 'false'); renderCatalog(); });
$('#list-view').addEventListener('click', () => { state.view = 'list'; $('#list-view').classList.add('is-active'); $('#grid-view').classList.remove('is-active'); $('#list-view').setAttribute('aria-pressed', 'true'); $('#grid-view').setAttribute('aria-pressed', 'false'); renderCatalog(); });
$('#home-button').addEventListener('click', () => { closeDetail(); setCategory('all'); });
$('#back-to-catalog').addEventListener('click', closeDetail);
$('#clear-search').addEventListener('click', () => setCategory('all'));
$('#menu-toggle').addEventListener('click', () => { const isOpen = elements.sidebar.classList.toggle('is-open'); $('#menu-toggle').setAttribute('aria-expanded', String(isOpen)); $('#menu-toggle').setAttribute('aria-label', isOpen ? 'Cerrar navegación' : 'Abrir navegación'); });
$('#open-preview').addEventListener('click', () => state.selected && window.open(state.selected.path, '_blank', 'noopener'));
$('#fullscreen-preview').addEventListener('click', () => elements.preview.querySelector('iframe')?.requestFullscreen?.());
$('#copy-source').addEventListener('click', () => copyText(elements.sourceCode.textContent, `${state.sourceType.toUpperCase()} original copiado`));
$('#theme-toggle').addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  $('#theme-toggle').setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'); localStorage.setItem('ui-vault-theme', dark ? 'dark' : 'light');
});
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); elements.search.focus(); }
  if (event.key === 'Escape') { if (!elements.detail.hidden) closeDetail(); else closeSidebar(); }
});
if (localStorage.getItem('ui-vault-theme') === 'dark') document.documentElement.dataset.theme = 'dark';
renderCatalog();
