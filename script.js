// Pobranie elementów z DOM
const postalCodeInput = document.getElementById('postalCode');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

// Funkcja do wyszukiwania posłów po kodzie pocztowym
async function searchDeputies() {
    const code = postalCodeInput.value.trim();
    if (!code) {
        resultsDiv.innerHTML = "<p>Proszę wpisać kod pocztowy.</p>";
        return;
    }

    try {
        // Pobranie danych z pliku JSON
        const response = await fetch('poslowie.json');
        const data = await response.json();

        // Szukanie okręgu zawierającego kod pocztowy
        let found = false;
        for (const okregId in data) {
            const okreg = data[okregId];
            if (okreg.kody_pocztowe.includes(code)) {
                found = true;
                displayResults(okreg);
                break;
            }
        }

        if (!found) {
            resultsDiv.innerHTML = `<p>Nie znaleziono posłów dla kodu: ${code}</p>`;
        }
    } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
        resultsDiv.innerHTML = "<p>Wystąpił błąd przy pobieraniu danych.</p>";
    }
}

// Funkcja do wyświetlania wyników
function displayResults(okreg) {
    let html = `<h2>Okręg: ${okreg.okreg}</h2>`;
    html += "<ul>";
    okreg.poslowie.forEach(posel => {
        html += `<li>${posel.imie} ${posel.nazwisko} (${posel.partia})</li>`;
    });
    html += "</ul>";
    resultsDiv.innerHTML = html;
}

// Obsługa kliknięcia przycisku
searchBtn.addEventListener('click', searchDeputies);

// Obsługa Enter w inpucie
postalCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchDeputies();
    }
});
