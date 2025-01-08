class CategoriesManager {
  constructor() {
    this.categories = [];
    this.initializeElements();
    this.fetchCategories();
  }

  initializeElements() {
    this.categoriesContainer = document.getElementById("categories-container");
    this.searchInput = document.querySelector("input[type='text']");
    this.searchInput.addEventListener("input", () => this.filterCategories());
  }

  async fetchCategories() {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");

      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Fetched categories:", data);

      this.categories = data;
      this.renderCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
      this.categoriesContainer.innerHTML =
        "<div>Error loading categories</div>";
    }
  }

  renderCategories(filteredCategories = this.categories) {
    if (!this.categoriesContainer) return;

    if (filteredCategories.length === 0) {
      this.categoriesContainer.innerHTML = "<div>No categories found</div>";
      return;
    }

    this.categoriesContainer.innerHTML = "";

    filteredCategories.forEach((category) => {
      const listItem = document.createElement("div");
      if (typeof category === "string") {
        listItem.textContent =
          category.charAt(0).toUpperCase() + category.slice(1);
      } else {
        listItem.textContent = category.name || "Unknown Category";
      }
      listItem.classList.add("category-item");
      this.categoriesContainer.appendChild(listItem);
    });
  }

  filterCategories() {
    const searchTerm = this.searchInput.value.toLowerCase();

    // Filtrowanie kategorii na podstawie wpisanego tekstu
    const filteredCategories = this.categories.filter((category) =>
      (typeof category === "string" ? category : category.name || "")
        .toLowerCase()
        .includes(searchTerm)
    );

    this.renderCategories(filteredCategories); // Renderowanie tylko przefiltrowanych kategorii
  }
}

// Initialize CategoriesManager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CategoriesManager();
});
