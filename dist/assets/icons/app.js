
const state = {
  icons: [],
  query: "",
  category: "All",
  size: 24,
  weight: "",
  motionMode: "semantic",
  motionEnabled: true,
  favoritesOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem("animatedIconFavorites") || "[]"))
};

const els = {
  search: document.querySelector("#searchInput"),
  categoryNav: document.querySelector("#categoryNav"),
  grid: document.querySelector("#iconGrid"),
  summary: document.querySelector("#resultsSummary"),
  empty: document.querySelector("#emptyState"),
  size: document.querySelector("#sizeSelect"),
  weight: document.querySelector("#weightSelect"),
  motion: document.querySelector("#motionSelect"),
  motionToggle: document.querySelector("#motionToggle"),
  favoritesToggle: document.querySelector("#favoritesToggle"),
  clear: document.querySelector("#clearFilters"),
  panel: document.querySelector("#detailPanel"),
  detail: document.querySelector("#detailContent"),
  closePanel: document.querySelector("#closePanel"),
  toast: document.querySelector("#toast")
};

const normalize = value =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function iconWithWeight(icon) {
  if (!state.weight) return icon;
  return `${icon}${state.weight}`;
}

function motionFor(icon) {
  if (!state.motionEnabled || state.motionMode === "none") return "none";
  if (state.motionMode !== "semantic") return state.motionMode;
  return icon.motion || "lift";
}

function saveFavorites() {
  localStorage.setItem("animatedIconFavorites", JSON.stringify([...state.favorites]));
}

function renderCategories() {
  const categories = ["All", ...new Set(state.icons.map(i => i.category).sort())];
  els.categoryNav.innerHTML = categories.map(category => `
    <button class="category-button ${state.category === category ? "is-active" : ""}" data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function filteredIcons() {
  const q = normalize(state.query.trim());

  return state.icons.filter(icon => {
    const categoryMatch = state.category === "All" || icon.category === state.category;
    const favoriteMatch = !state.favoritesOnly || state.favorites.has(icon.icon);

    if (!q) return categoryMatch && favoriteMatch;

    const haystack = normalize([
      icon.name, icon.slug, icon.category, icon.motion, ...icon.keywords
    ].join(" "));

    return categoryMatch && favoriteMatch && haystack.includes(q);
  });
}

function render() {
  const items = filteredIcons();
  els.summary.textContent = `${items.length} de ${state.icons.length} iconos`;
  els.empty.hidden = items.length !== 0;
  els.grid.hidden = items.length === 0;

  els.grid.innerHTML = items.map(icon => {
    const isFavorite = state.favorites.has(icon.icon);
    const motion = motionFor(icon);

    return `
      <article class="icon-card" data-icon="${icon.icon}" tabindex="0" role="button" aria-label="Abrir ${icon.name}">
        <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" data-favorite="${icon.icon}" aria-label="Favorito">
          <iconify-icon icon="${isFavorite ? "ph:star-fill" : "ph:star"}"></iconify-icon>
        </button>

        <div class="icon-stage">
          <span class="motion-wrap" data-motion="${motion}">
            <iconify-icon icon="${iconWithWeight(icon.icon)}" width="${state.size}" height="${state.size}"></iconify-icon>
          </span>
        </div>

        <div>
          <span class="icon-name">${icon.name}</span>
          <span class="icon-category">${icon.category}</span>
          <span class="motion-name">${motion === "none" ? "static" : motion}</span>
        </div>
      </article>
    `;
  }).join("");
}

function cssSnippet(motion) {
  if (motion === "none") return `.icon { transition: transform .2s ease; }`;
  return `.icon:hover { animation: ${motion} .55s cubic-bezier(.2,.8,.2,1); }`;
}

function openDetail(iconId) {
  const icon = state.icons.find(item => item.icon === iconId);
  if (!icon) return;

  const renderedIcon = iconWithWeight(icon.icon);
  const motion = motionFor(icon);

  els.detail.innerHTML = `
    <div class="detail-icon-box">
      <span class="motion-wrap" data-motion="${motion}">
        <iconify-icon icon="${renderedIcon}" width="92" height="92"></iconify-icon>
      </span>
    </div>

    <h2 class="detail-name">${icon.name}</h2>
    <p class="detail-path">${renderedIcon}</p>

    <div class="detail-section">
      <h3>Uso recomendado</h3>
      <p style="margin:0;color:var(--muted);line-height:1.65;font-size:13px">
        Categoría: <strong style="color:var(--text)">${icon.category}</strong><br>
        Motion: <strong style="color:var(--text)">${motion}</strong>
      </p>
    </div>

    <div class="detail-section">
      <h3>Keywords</h3>
      <ul class="keyword-list">
        ${icon.keywords.map(k => `<li>${k}</li>`).join("")}
      </ul>
    </div>

    <div class="detail-section">
      <h3>Copiar</h3>
      <div class="copy-grid">
        <button class="copy-button" data-copy="${icon.slug}">Nombre</button>
        <button class="copy-button" data-copy="${renderedIcon}">Iconify ID</button>
        <button class="copy-button" data-copy='<iconify-icon icon="${renderedIcon}"></iconify-icon>'>HTML</button>
        <button class="copy-button" data-copy='${cssSnippet(motion).replace(/'/g, "&apos;")}'>Motion CSS</button>
      </div>
    </div>
  `;

  els.panel.classList.add("is-open");
  els.panel.setAttribute("aria-hidden", "false");
}

function closeDetail() {
  els.panel.classList.remove("is-open");
  els.panel.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("is-visible"), 1200);
}

function clearFilters() {
  state.query = "";
  state.category = "All";
  state.favoritesOnly = false;
  state.motionMode = "semantic";
  els.search.value = "";
  els.motion.value = "semantic";
  els.favoritesToggle.classList.remove("is-active");
  renderCategories();
  render();
}

els.search.addEventListener("input", e => { state.query = e.target.value; render(); });

els.categoryNav.addEventListener("click", e => {
  const button = e.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  render();
});

els.size.addEventListener("change", e => { state.size = Number(e.target.value); render(); });
els.weight.addEventListener("change", e => { state.weight = e.target.value; render(); });
els.motion.addEventListener("change", e => { state.motionMode = e.target.value; render(); });

els.motionToggle.addEventListener("click", () => {
  state.motionEnabled = !state.motionEnabled;
  document.body.classList.toggle("motion-off", !state.motionEnabled);
  els.motionToggle.classList.toggle("is-active", state.motionEnabled);
  render();
});

els.favoritesToggle.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  els.favoritesToggle.classList.toggle("is-active", state.favoritesOnly);
  render();
});

els.clear.addEventListener("click", clearFilters);
els.closePanel.addEventListener("click", closeDetail);

els.grid.addEventListener("click", e => {
  const favorite = e.target.closest("[data-favorite]");
  if (favorite) {
    e.stopPropagation();
    const id = favorite.dataset.favorite;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    saveFavorites();
    render();
    return;
  }
  const card = e.target.closest("[data-icon]");
  if (card) openDetail(card.dataset.icon);
});

els.grid.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-icon]")) {
    e.preventDefault();
    openDetail(e.target.dataset.icon);
  }
});

els.detail.addEventListener("click", async e => {
  const button = e.target.closest("[data-copy]");
  if (!button) return;
  await navigator.clipboard.writeText(button.dataset.copy);
  showToast("Copiado");
});

document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== els.search) {
    e.preventDefault();
    els.search.focus();
  }
  if (e.key === "Escape") closeDetail();
});

async function init() {
  const response = await fetch("./icon-catalog.json");
  state.icons = await response.json();
  els.motionToggle.classList.add("is-active");
  renderCategories();
  render();
}

init().catch(error => {
  console.error(error);
  els.grid.innerHTML = "<p>Error cargando icon-catalog.json. Ejecuta el proyecto con un servidor local.</p>";
});
