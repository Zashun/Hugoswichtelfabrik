// Array mit den Namen der Teilnehmer
const participants = [
    "Basti", "Julia", "Dirk", "Steh-Vieh", "Romy", 
    "Christian", "Lina", "Moritz", "Sissi", "Bartosz", 
    "David", "Monika", "Sascha", "Violetta", "Sammy", 
    "Sven", "Angi", "Andrea"
];

// Array, um die Briefe und ihren Status zu speichern
const letters = Array.from(document.querySelectorAll('.letter'));
const assignedNames = {};
const resultDiv = document.createElement('div');
const resultImage = document.createElement('img');
const resultText = document.createElement('p');

// Funktion, um einen zufälligen Namen zu wählen
function getRandomName(exclude) {
    const availableNames = participants.filter(name => name !== exclude);
    if (availableNames.length === 0) return null; // Keine verfügbaren Namen
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
}

// Ergebnis-Bereich erstellen
resultDiv.style.display = 'none'; // Anfangs versteckt
resultDiv.style.position = 'fixed';
resultDiv.style.top = '50%';
resultDiv.style.left = '50%';
resultDiv.style.transform = 'translate(-50%, -50%)';
resultDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Halbtransparentes Hintergrund
resultDiv.style.padding = '20px';
resultDiv.style.borderRadius = '10px';
resultDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
document.body.appendChild(resultDiv);

resultImage.style.maxWidth = '200px'; // Maximale Bildbreite
resultDiv.appendChild(resultImage);
resultText.style.fontSize = '1.5em';
resultDiv.appendChild(resultText);

// Event-Listener für die Briefe
letters.forEach(letter => {
    letter.style.backgroundImage = "url('Brief zu.jfif')"; // Standardmäßig geschlossene Briefe
    letter.addEventListener('click', function() {
        const letterIndex = letters.indexOf(this);
        
        // Überprüfen, ob der Brief schon geöffnet wurde
        if (assignedNames[letterIndex]) {
            alert("Dieser Brief wurde bereits geöffnet!");
            return;
        }

        // Zuweisung eines Namens
        const recipient = getRandomName(null);
        if (recipient) {
            assignedNames[letterIndex] = recipient;
            this.style.backgroundImage = "url('Brief offen.jfif')"; // Brief wird geöffnet
            resultImage.src = 'path/to/image/' + recipient + '.jpg'; // Bild für den Wichtelpartner (ersetze den Pfad)
            resultText.textContent = `Du hast ${recipient} gezogen!`; // Nachricht an den Nutzer
            resultDiv.style.display = 'block'; // Ergebnisbereich anzeigen

            // Briefe nicht mehr klickbar machen
            letters.forEach(l => {
                l.style.pointerEvents = 'none'; // Deaktiviere das Klicken
            });
        } else {
            alert("Es gibt keine verfügbaren Teilnehmer mehr.");
        }
    });
});
