document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toUpperCase().replace('*', '');
    const resultsBody = document.getElementById('resultsBody');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');

    // Validate input
    if (query === '') {
        alert('Please enter a store number to search.');
        return;
    }

    resultsBody.innerHTML = ''; // Clear previous results
    noResults.style.display = 'none'; // Hide no results message
    loading.style.display = 'block'; // Show loading indicator

    fetch('data.json')
        .then(response => response.json())
        .then(storeData => {
            const filteredStores = storeData.filter(store => store.store_id.includes(query));

            if (filteredStores.length > 0) {
                filteredStores.forEach(store => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${store.store_id}</td>
                        <td>${store.location}</td>
                        <td>${store.store_type}</td>
                        <td>${store.country}</td>
                    `;
                    resultsBody.appendChild(row);
                });
            } else {
                noResults.style.display = 'block'; // Show no results message
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            noResults.style.display = 'block'; // Show no results message in case of error
        })
        .finally(() => {
            loading.style.display = 'none'; // Hide loading indicator
        });
}
