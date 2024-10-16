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

    // Validate input
    if (query.trim() === '') {
        alert('Please enter a store number to search.');
        return;
    }

    resultsBody.innerHTML = ''; // Clear previous results
    noResults.style.display = 'none'; // Hide no results message
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
                    const divisionCode = store.store_id.substring(2, 4);
                    let storeType = '';
                    let country = '';

                    // Determine store type based on division code
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
                        storeType = store.store_id.charAt(4) === '0' ? 'Foot Locker Europe/Asia' : 'Kids Foot Locker';
                        country = extractCountryFromLocation(store.location);
                    } else if (divisionCode.startsWith('24') || divisionCode.startsWith('28')) {
                        storeType = 'Foot Locker Australia';
                        country = 'Australia'; 
                    } else if (divisionCode.startsWith('76')) {
                        storeType = 'Foot Locker Canada';
                        country = 'Canada'; 
                    } else if (divisionCode.startsWith('77')) {
                        storeType = 'Champs Canada';
                        country = 'Canada'; 
                    } else {
                        storeType = 'Unknown';
                        country = 'Unknown';
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${store.store_id}</td>
                        <td>${storeType}</td>
                        <td>${country}</td>
                    `;
                    resultsBody.appendChild(row);
                });
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

// Function to extract country from location
function extractCountryFromLocation(location) {
    if (location.includes('Canada')) {
        return 'Canada';
    } else if (location.includes('Australia')) {
        return 'Australia';
    } else if (location.includes('UK') || location.includes('England')) {
        return 'UK';
    } else if (location.includes('France')) {
        return 'France';
    }
    return 'Unknown'; 
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
