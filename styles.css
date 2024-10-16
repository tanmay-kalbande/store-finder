// Debounce function to limit how often the search is performed
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Perform search function
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsBody = document.getElementById('resultsBody');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    // Validate input
    if (query.trim() === '') {
        noResults.style.display = 'none';
        results.style.display = 'none';
        alert('Please enter a store number to search.');
        return;
    }

    resultsBody.innerHTML = ''; // Clear previous results
    noResults.style.display = 'none';
    loading.style.display = 'block'; // Show loading indicator

    fetch('data.json') // Adjust this URL as necessary
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(storeData => {
            const filteredStores = storeData.filter(store =>
                store.store_id.toLowerCase().includes(query)
            );

            if (filteredStores.length > 0) {
                filteredStores.forEach(store => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${store.store_id}</td>
                        <td>${getStoreType(store.store_id)}</td>
                        <td>${store.location}</td>
                    `;
                    resultsBody.appendChild(row);
                });
                results.style.display = 'block';
            } else {
                noResults.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            noResults.textContent = 'An error occurred while fetching data. Please try again.';
            noResults.style.display = 'block';
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

function getStoreType(storeId) {
    const divisionCode = storeId.substring(2, 4);
    switch (divisionCode) {
        case '03': return 'Foot Locker';
        case '16': return 'Kids Foot Locker';
        case '18': return 'Champs';
        default: return 'Unknown';
    }
}

// Debounced search function
const debouncedSearch = debounce(performSearch, 300);

// Event listeners
document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('input', debouncedSearch);
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});
