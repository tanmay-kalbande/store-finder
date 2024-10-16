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
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsBody = document.getElementById('resultsBody');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    const results = document.getElementById('results');
    const errorMessage = document.getElementById('errorMessage');

    // Validate input
    if (query === '') {
        showEmptyState();
        return;
    }

    resultsBody.innerHTML = ''; // Clear previous results
    noResults.style.display = 'none';
    errorMessage.style.display = 'none';
    emptyState.style.display = 'none';
    results.style.display = 'none';
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
                    const row = createStoreRow(store);
                    resultsBody.appendChild(row);
                });
                results.style.display = 'block';
            } else {
                noResults.style.display = 'block'; 
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            loading.style.display = 'none'; 
        });
}

function createStoreRow(store) {
    const row = document.createElement('tr');
    const divisionCode = store.store_id.substring(2, 4);
    const storeType = getStoreType(divisionCode, store.store_id);
    const country = store.location;

    row.innerHTML = `
        <td data-label="Store ID">${store.store_id}</td>
        <td data-label="Store Type"><i class="${getStoreIcon(storeType)} store-type-icon"></i>${storeType}</td>
        <td data-label="Country">${country}</td>
    `;
    return row;
}

function getStoreType(divisionCode, storeId) {
    switch (divisionCode) {
        case '03': return 'Foot Locker';
        case '16': return 'Kids Foot Locker';
        case '18': return 'Champs';
        case '31':
            return storeId.charAt(4) === '0' ? 'Foot Locker Europe/Asia' : 'Kids Foot Locker';
        case '24':
        case '28': return 'Foot Locker Australia';
        case '76': return 'Foot Locker Canada';
        case '77': return 'Champs Canada';
        default: return 'Unknown';
    }
}

function getStoreIcon(storeType) {
    switch (storeType) {
        case 'Foot Locker': return 'fas fa-shoe-prints';
        case 'Kids Foot Locker': return 'fas fa-child';
        case 'Champs': return 'fas fa-trophy';
        default: return 'fas fa-store';
    }
}

function showEmptyState() {
    document.getElementById('emptyState').style.display = 'block';
}
