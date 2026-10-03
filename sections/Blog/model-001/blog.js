/* ==========================================================
   MIRA BLOG
   Search + filters + load more
   ========================================================== */

const filterButtons = document.querySelectorAll(".filter-button");
const articleCards = document.querySelectorAll(".article-card");

const searchInput = document.getElementById("articleSearch");
const emptyState = document.getElementById("emptyState");
const loadMoreButton = document.getElementById("loadMore");

let activeCategory = "all";
let searchQuery = "";
let expanded = false;


/* ==========================================================
   NORMALIZE TEXT
   ========================================================== */

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


/* ==========================================================
   FILTER ARTICLES
   ========================================================== */

function updateArticles() {

  let visibleArticles = 0;

  articleCards.forEach((article, index) => {

    const category = article.dataset.category;

    const searchableText = normalizeText(
      `${article.dataset.search || ""} ${article.innerText}`
    );

    const categoryMatch =
      activeCategory === "all" ||
      category === activeCategory;

    const searchMatch =
      searchableText.includes(
        normalizeText(searchQuery)
      );

    const matches =
      categoryMatch &&
      searchMatch;

    /*
     * When there is no active filtering/search,
     * only show the first 6 until Load More.
     */

    const normalView =
      activeCategory === "all" &&
      searchQuery === "";

    const hiddenByPagination =
      normalView &&
      !expanded &&
      index >= 6;


    if (matches && !hiddenByPagination) {

      article.classList.remove(
        "filtered-out",
        "hidden-article"
      );

      visibleArticles++;

    } else {

      article.classList.add("filtered-out");

    }

  });


  /* EMPTY STATE */

  if (visibleArticles === 0) {
    emptyState.classList.add("visible");
  } else {
    emptyState.classList.remove("visible");
  }


  /* LOAD MORE VISIBILITY */

  const shouldShowLoadMore =
    activeCategory === "all" &&
    searchQuery === "" &&
    !expanded &&
    articleCards.length > 6;

  loadMoreButton.classList.toggle(
    "is-hidden",
    !shouldShowLoadMore
  );

}


/* ==========================================================
   CATEGORY FILTERS
   ========================================================== */

filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    activeCategory = button.dataset.category;

    expanded = false;

    updateArticles();

  });

});


/* ==========================================================
   SEARCH
   ========================================================== */

searchInput.addEventListener("input", (event) => {

  searchQuery = event.target.value.trim();

  expanded = false;

  updateArticles();

});


/* ==========================================================
   LOAD MORE
   ========================================================== */

loadMoreButton.addEventListener("click", () => {

  expanded = true;

  updateArticles();

});


/* ==========================================================
   INITIALIZE
   ========================================================== */

updateArticles();