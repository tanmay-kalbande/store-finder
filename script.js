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

// Enhanced search function
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsBody = document.getElementById('resultsBody');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');

    // Validate input
    if (query === '') {
        alert('Please enter a store number or location to search.');
        return;
    }

    resultsBody.innerHTML = ''; // Clear previous results
    noResults.style.display = 'none'; // Hide no results message
    loading.style.display = 'block'; // Show loading indicator

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(storeData => {
            const filteredStores = storeData.filter(store => 
                store.store_id.toLowerCase().includes(query) ||
                store.location.toLowerCase().includes(query)
            );

            if (filteredStores.length > 0) {
                filteredStores.forEach(store => {
                    const divisionCode = store.store_id.substring(2, 4);
                    let storeType = '';
                    let country = '';

                    // Determine store type and country based on division code
                    if (divisionCode === '03') {
                        storeType = 'Foot Locker';
                        country = 'US';
                    } else if (divisionCode === '16') {
                        storeType = 'Kids Foot Locker';
                        country = 'US';
                    } else if (divisionCode === '18') {
                        storeType = 'Champs';
                        country = 'US';
                    } else if (divisionCode.startsWith('31')) {
                        storeType = divisionCode === '31' ? 'Foot Locker Europe/Asia' : 'Kids Foot Locker';
                        country = 'Europe/Asia';
                    } else if (divisionCode.startsWith('24') || divisionCode.startsWith('28')) {
                        storeType = 'Foot Locker Australia';
                        country = 'Australia';
                    } else if (divisionCode.startsWith('76')) {
                        storeType = 'Foot Locker Canada';
                        country = 'Canada';
                    } else if (divisionCode.startsWith('77')) {
                        storeType = 'Champs Canada';
                        country = 'Canada';
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${store.store_id}</td>
                        <td>${store.location}</td>
                        <td>${storeType}</td>
                        <td>${country}</td>
                    `;
                    resultsBody.appendChild(row);
                });
            } else {
                noResults.style.display = 'block'; // Show no results message
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            noResults.textContent = 'An error occurred while fetching data. Please try again.';
            noResults.style.display = 'block'; // Show error message
        })
        .finally(() => {
            loading.style.display = 'none'; // Hide loading indicator
        });
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

// Add sorting functionality
document.querySelectorAll('th').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        Array.from(tbody.querySelectorAll('tr'))
            .sort((a, b) => {
                const aVal = a.querySelector(`td:nth-child(${th.cellIndex + 1})`).textContent;
                const bVal = b.querySelector(`td:nth-child(${th.cellIndex + 1})`).textContent;
                return aVal.localeCompare(bVal);
            })
            .forEach(tr => tbody.appendChild(tr));
        
        // Update aria-sort attribute
        th.parentNode.querySelectorAll('th').forEach(header => header.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending');
    });
});
