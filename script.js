// Pobranie elementów z DOM
const postalCodeInput = document.getElementById('postalCode');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

// Funkcja do normalizacji kodu pocztowego (usuwa spacje, myślniki, zamienia na wielkie litery)
function normalizePostalCode(code) {
    return code.replace(/\s|-/g, '').toUpperCase();
}

// Funkcja sprawdzająca, czy kod pocztowy znajduje się w tablicy kodów
function isPostalCodeInDistrict(code, kody_pocztowe) {
    // Zamień kod na format XX-XXX
    let formattedCode = code.replace(/\s|-/g, '');
    if (formattedCode.length === 5) {
        formattedCode = formattedCode.substring(0,2) + '-' + formattedCode.substring(2);
    }
    return kody_pocztowe.includes(formattedCode);
}

// Funkcja do wyszukiwania posłów po kodzie pocztowym
async function searchDeputies() {
    const code = postalCodeInput.value.trim();
    if (!code) {
        resultsDiv.innerHTML = "<p>Proszę wpisać kod pocztowy.</p>";
        return;
    }

    try {
        const response = await fetch('poslowie.json');
        const data = await response.json();

        // Sprawdź, czy kod pocztowy znajduje się w tablicy
        if (isPostalCodeInDistrict(code, data.kody_pocztowe)) {
            displayResults(data);
        } else {
            resultsDiv.innerHTML = `<p>Nie znaleziono posłów dla kodu: ${code}</p>`;
        }
    } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
        resultsDiv.innerHTML = "<p>Wystąpił błąd przy pobieraniu danych.</p>";
    }
}

// Funkcja do wyświetlania wyników
function displayResults(data) {
    let html = `<h2>Okręg: ${data.okreg_wyborczy.siedziba} (${data.okreg_wyborczy.wojewodztwo})</h2>`;
    html += `<p>${data.okreg_wyborczy.opis}</p>`;
    html += "<ul>";
    data.poslowie.forEach(posel => {
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
