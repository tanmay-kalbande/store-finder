document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = document.getElementById('searchInput').value.toUpperCase().replace('*', '');
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
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(storeData => {
            const filteredStores = storeData.filter(store => store.store_id.includes(query));

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
            noResults.style.display = 'block'; // Show no results message on error
        })
        .finally(() => {
            loading.style.display = 'none'; // Hide loading indicator
        });
}
