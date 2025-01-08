class ProductsManager {
    constructor() {
      this.products = [];
      this.currentPage = 1;
      this.itemsPerPage = 10;
      this.currentProduct = null;
      this.initializeElements();
      this.setupEventListeners();
      this.fetchProducts();
    }
  
    initializeElements() {
      this.productsList = document.getElementById('products-list');
      this.productTemplate = document.getElementById('product-row-template');
      this.searchInput = document.querySelector('.search-bar input');
      this.selectAll = document.querySelector('.select-all');
      this.productDetailsModal = document.getElementById('product-details-modal');
    }
  
    setupEventListeners() {
      this.searchInput?.addEventListener('input', () => this.filterProducts());
      this.selectAll?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
      this.productsList?.addEventListener('click', (e) => {
        const productRow = e.target.closest('tr');
        if (productRow) {
          const productId = productRow.dataset.productId;
          if (productId) {
            this.showProductDetails(productId);
          }
        }
      });

      // Close modal when clicking outside or on close button
      document.addEventListener('click', (e) => {
        if (e.target.matches('.modal-overlay') || e.target.matches('.modal-close')) {
          this.hideProductDetails();
        }
      });
    }
  
    async fetchProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        this.products = data.products;
        this.renderProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    renderProducts() {
      if (!this.productsList) return;
      
      this.productsList.innerHTML = '';
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedProducts = this.products.slice(start, end);
  
      paginatedProducts.forEach(product => {
        const row = this.productTemplate.content.cloneNode(true);
        
        // Image
        const img = row.querySelector('.product-thumbnail');
        if (img) {
            img.src = product.thumbnail;
            img.alt = product.title;
        }
        
        // Name
        const titleCell = row.querySelector('.product-title');
        if (titleCell) {
            titleCell.textContent = product.title;
        }

        // SKU
        const idCell = row.querySelector('.product-id');
        if (idCell) {
            idCell.textContent = `SKU-${product.id.toString().padStart(6, '0')}`;
        }

        // Inventory
        const inventoryCount = row.querySelector('.inventory-count');
        if (inventoryCount) {
            inventoryCount.textContent = product.stock;
        }

        // Category
        const categoryCell = row.querySelector('.category-cell');
        if (categoryCell) {
            categoryCell.textContent = product.category.charAt(0).toUpperCase() + 
                                     product.category.slice(1);
        }

        // Price
        const priceCell = row.querySelector('.price-cell');
        if (priceCell) {
            priceCell.textContent = new Intl.NumberFormat('en-US', 
                { style: 'currency', currency: 'USD' }
            ).format(product.price);
        }

        // Add product ID to the row
        row.querySelector('tr').dataset.productId = product.id;

        this.productsList.appendChild(row);
      });
  
      this.updatePagination();
    }
  
    updatePagination() {
      const totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      const paginationInfo = document.querySelector('.pagination-info');
      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(start + this.itemsPerPage - 1, this.products.length);
      
      if (paginationInfo) {
        paginationInfo.innerHTML = 
          `Showing <span>${start}-${end}</span> of <span>${this.products.length}</span> products`;
      }
  
      // Update page numbers
      const pageNumbers = document.querySelector('.page-numbers');
      if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
          if (
            i === 1 || 
            i === totalPages || 
            (i >= this.currentPage - 1 && i <= this.currentPage + 1)
          ) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.toggle('active', i === this.currentPage);
            button.addEventListener('click', () => {
              this.currentPage = i;
              this.renderProducts();
            });
            pageNumbers.appendChild(button);
          } else if (
            i === this.currentPage - 2 || 
            i === this.currentPage + 2
          ) {
            const span = document.createElement('span');
            span.textContent = '...';
            pageNumbers.appendChild(span);
          }
        }
      }
    }
  
    toggleSelectAll(checked) {
      const checkboxes = this.productsList.querySelectorAll('.select-product');
      checkboxes.forEach(checkbox => checkbox.checked = checked);
    }
  
    filterProducts() {
      const searchTerm = this.searchInput.value.toLowerCase();
      const filtered = this.products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
      this.currentPage = 1;
      this.renderProducts(filtered);
    }
  
    async showProductDetails(productId) {
      try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        
        this.productDetailsModal.innerHTML = this.generateProductDetailsHTML(product);
        this.productDetailsModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }
  
    hideProductDetails() {
      this.productDetailsModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  
    generateProductDetailsHTML(product) {
      return `
        <div class="modal-overlay">
          <div class="modal-content">
            <button class="modal-close">×</button>
            <div class="product-details">
              <div class="product-images">
                <img src="${product.thumbnail}" alt="${product.title}" class="main-image">
                <div class="image-gallery">
                  ${product.images.map(img => `
                    <img src="${img}" alt="${product.title}" class="thumbnail">
                  `).join('')}
                </div>
              </div>
              <div class="product-info">
                <h2>${product.title}</h2>
                <div class="product-meta">
                  <span class="brand">Brand: ${product.brand}</span>
                  <span class="category">Category: ${product.category}</span>
                </div>
                <div class="rating">
                  <span class="stars" style="--rating: ${product.rating}"></span>
                  <span class="rating-value">${product.rating}/5</span>
                </div>
                <p class="description">${product.description}</p>
                <div class="price-stock">
                  <div class="price">
                    <span class="current-price">$${product.price}</span>
                    ${product.discountPercentage ? `
                      <span class="discount">-${Math.round(product.discountPercentage)}%</span>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new ProductsManager();
  });

  document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.querySelector('.fa-file-export').closest('button');
    const importBtn = document.querySelector('.fa-file-import').closest('button');

    exportBtn.addEventListener('click', function() {
        const products = getProductsData(); // You'll need to implement this
        
        const csvContent = convertToCSV(products); // You'll need to implement this
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'products-export.csv');
        a.click();
        window.URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const csvData = event.target.result;
                processImportedData(csvData);
            };
            
            reader.readAsText(file);
        });
        
        fileInput.click();
    });
});

function convertToCSV(products) {
    const headers = ['id', 'name', 'price', 'category', 'inventory'];
    const rows = products.map(p => [p.id, p.name, p.price, p.category, p.inventory].join(','));
    return [headers.join(','), ...rows].join('\n');
}

function processImportedData(csvData) {
    console.log('Processing imported data:', csvData);
}