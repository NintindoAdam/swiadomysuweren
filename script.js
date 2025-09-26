let data = null;

// Ładowanie JSON-a
fetch("data.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    console.log("Dane załadowane:", data);
  })
  .catch(error => {
    console.error("Błąd wczytywania JSON:", error);
  });

// Funkcja wyszukiwania
function sprawdzKod() {
  const input = document.getElementById("kodInput").value.trim();
  const wynikDiv = document.getElementById("wynik");

  wynikDiv.innerHTML = ""; // czyścimy poprzedni wynik

  if (!data) {
    wynikDiv.textContent = "Dane jeszcze się ładują...";
    return;
  }

  if (data.kody_pocztowe.includes(input)) {
    const lista = document.createElement("ul");
    data.poslowie.forEach(posel => {
      const li = document.createElement("li");
      li.textContent = `${posel.imie} ${posel.nazwisko} (${posel.partia})`;
      lista.appendChild(li);
    });
    wynikDiv.appendChild(lista);
  } else {
    wynikDiv.textContent = "Podany kod pocztowy nie należy do tego okręgu wyborczego.";
  }
}