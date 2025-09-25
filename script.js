// Pobranie elementów z DOM
const postalCodeInput = document.getElementById('postalCode');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

// Funkcja do normalizacji kodu pocztowego (usuwa spacje, myślniki, zamienia na wielkie litery)
function normalizePostalCode(code) {
    return code.replace(/\s|-/g, '').toUpperCase();
}

// Funkcja sprawdzająca, czy kod pocztowy pasuje do prefixu lub zakresu
function isPostalCodeInDistrict(code, kody_pocztowe) {
    // Zamień kod na format bez spacji i wielkie litery
    const normalized = code.replace(/\s/g, '').toUpperCase();

    // Sprawdź prefixy (porównaj pierwsze dwie cyfry kodu)
    if (Array.isArray(kody_pocztowe.prefixy)) {
        const codePrefix = normalized.substring(0, 2);
        for (const prefix of kody_pocztowe.prefixy) {
            if (codePrefix === prefix) {
                return true;
            }
        }
    }

    // Sprawdź zakresy (porównaj pełny kod XX-XXX)
    if (Array.isArray(kody_pocztowe.zakresy)) {
        // Zamień kod na format XX-XXX (jeśli wpisano bez myślnika)
        let formattedCode = normalized;
        if (formattedCode.length === 5 && !formattedCode.includes('-')) {
            formattedCode = formattedCode.substring(0,2) + '-' + formattedCode.substring(2);
        }
        for (const zakres of kody_pocztowe.zakresy) {
            if (formattedCode >= zakres.od && formattedCode <= zakres.do) {
                return true;
            }
        }
    }

    return false;
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

        let found = false;
        for (const okregId in data) {
            const okreg = data[okregId];
            if (okreg.kody_pocztowe && isPostalCodeInDistrict(code, okreg.kody_pocztowe)) {
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
