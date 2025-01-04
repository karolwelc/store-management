class ProductsManager {
    constructor() {
      this.products = [];
      this.currentPage = 1;
      this.itemsPerPage = 10;
      this.initializeElements();
      this.setupEventListeners();
      this.fetchProducts();
    }
  
    initializeElements() {
      this.productsList = document.getElementById('products-list');
      this.productTemplate = document.getElementById('product-row-template');
      this.searchInput = document.querySelector('.search-bar input');
      this.selectAll = document.querySelector('.select-all');
    }
  
    setupEventListeners() {
      this.searchInput?.addEventListener('input', () => this.filterProducts());
      this.selectAll?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
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
        
        const img = row.querySelector('.product-thumbnail');
        img.src = product.thumbnail;
        img.alt = product.title;
        
        row.querySelector('.product-title').textContent = product.title;
        row.querySelector('.product-id').textContent = `SKU: ${product.id}`;
        
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = product.stock > 0 ? 'Active' : 'Out of stock';
        statusBadge.classList.add(product.stock > 0 ? 'active' : 'draft');
        
        row.querySelector('.inventory-count').textContent = product.stock;
        
        row.querySelector('.category-cell').textContent = 
          product.category.charAt(0).toUpperCase() + product.category.slice(1);
        
        row.querySelector('.price-cell').textContent = 
          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
            .format(product.price);
  
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