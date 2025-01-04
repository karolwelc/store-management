// Add this to your dashboard.js file
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.quick-filters button');
  
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          this.classList.add('active');
          
          const timePeriod = this.textContent;
          
          console.log('Selected time period:', timePeriod);
      });
  });
});
function createCharts(products) {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = '#64748b';
  Chart.defaults.plugins.legend.position = 'bottom';

  const categoryData = {};
  products.forEach(product => {
    categoryData[product.category] = (categoryData[product.category] || 0) + 1;
  });

  new Chart(document.getElementById('categoryChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(categoryData),
      datasets: [{
        label: 'Products',
        data: Object.values(categoryData),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        maxBarThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Price Distribution Chart
  new Chart(document.getElementById('priceChart'), {
    type: 'doughnut',
    data: {
      labels: ['$0-50', '$51-100', '$101-200', '$201+'],
      datasets: [{
        data: [
          products.filter(p => p.price <= 50).length,
          products.filter(p => p.price > 50 && p.price <= 100).length,
          products.filter(p => p.price > 100 && p.price <= 200).length,
          products.filter(p => p.price > 200).length
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20
          }
        }
      }
    }
  });

  const topRated = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  new Chart(document.getElementById('ratingChart'), {
    type: 'bar',
    data: {
      labels: topRated.map(p => p.title.substring(0, 20) + '...'),
      datasets: [{
        label: 'Rating',
        data: topRated.map(p => p.rating),
        backgroundColor: '#10b981',
        borderRadius: 8,
        maxBarThickness: 40
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          max: 5
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}