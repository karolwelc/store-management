class CategoriesManager {
  constructor() {
    this.categories = [];
    this.initializeElements();
    this.fetchCategories();
  }

  initializeElements() {
    this.categoriesContainer = document.getElementById("categories-list");
    this.searchInput = document.querySelector("input[type='text']");
    this.searchInput.addEventListener("input", () => this.filterCategories());

    // Modal elements
    this.modal = document.getElementById("category-products-modal");
    if (this.modal) {
      this.modalCloseBtn = this.modal.querySelector(".modal-close");
      if (this.modalCloseBtn) {
        this.modalCloseBtn.addEventListener("click", () => this.closeModal());
      }
    }
  }

  async fetchCategories() {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      this.categories = data;
      this.renderCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
      this.categoriesContainer.innerHTML = "Error loading categories";
    }
  }

  renderCategories(filteredCategories = this.categories) {
    if (!this.categoriesContainer) return;

    if (filteredCategories.length === 0) {
      this.categoriesContainer.innerHTML = "No categories found";
      return;
    }

    this.categoriesContainer.innerHTML = filteredCategories
      .map(category => `
        <div class="category-card" onclick="categoriesManager.viewCategoryProducts('${category.slug}')">
          <div class="category-icon">
            <i class="fas fa-tag"></i>
          </div>
          <h3>${category.name}</h3>
          <p>Click to view products</p>
        </div>
      `).join("");
  }

  filterCategories() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm)
    );
    this.renderCategories(filteredCategories);
  }

  async viewCategoryProducts(categorySlug) {
    try {
      const response = await fetch(`https://dummyjson.com/products/category/${categorySlug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch category products");
      }

      const data = await response.json();
      
      // Find the category name from our categories array
      const category = this.categories.find(cat => cat.slug === categorySlug);
      const categoryName = category ? category.name : categorySlug;
      
      // Update modal content
      document.getElementById("category-name").textContent = categoryName;
      const productsContainer = document.getElementById("category-products");
      
      productsContainer.innerHTML = data.products
        .map(product => `
          <div class="product-card">
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="product-info">
              <h4>${product.title}</h4>
              <p class="price">$${product.price}</p>
              <p class="description">${product.description}</p>
            </div>
          </div>
        `).join("");

      if (this.modal) {
        this.modal.classList.add("active");
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove("active");
    }
  }
}

// Initialize the categories manager
const categoriesManager = new CategoriesManager();
