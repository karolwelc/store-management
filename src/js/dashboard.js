// Fetch and initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch products from dummyJSON API
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        const products = data.products;
        
        // Update stats
        updateStats(products);
        
        // Create charts
        createCharts(products);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function updateStats(products) {
    try {
        // Total Products
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('productTrend').textContent = '12.5% from last month';

        // Average Rating
        const avgRating = (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1);
        document.getElementById('avgRating').textContent = avgRating;
        document.getElementById('ratingTrend').textContent = 'Based on all products';
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function createCharts(products) {
    // Set default styles for all charts
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.color = '#64748b';
    
    createCategoryChart(products);
    createPriceDistributionChart(products);
}

function createCategoryChart(products) {
    try {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const categoryData = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: colors,
                    borderRadius: 8,
                    maxBarThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { 
                            display: true,
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { 
                            maxRotation: 45, 
                            minRotation: 45,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating category chart:', error);
    }
}

function createPriceDistributionChart(products) {
    const priceRanges = {
        '$0-50': products.filter(p => p.price <= 50).length,
        '$51-200': products.filter(p => p.price > 50 && p.price <= 200).length,
        '$201-500': products.filter(p => p.price > 200 && p.price <= 500).length,
        '$500+': products.filter(p => p.price > 500).length
    };

    new Chart(document.getElementById('priceChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(priceRanges),
            datasets: [{
                data: Object.values(priceRanges),
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
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 }
                }
            }
        }
    });
}