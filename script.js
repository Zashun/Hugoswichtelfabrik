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

// Neues Element für das Modal
const resultDiv = document.getElementById('result');
const recipientName = document.getElementById('recipientName');
const closeBtn = document.getElementById('closeBtn');

// Event-Listener für das Schließen des Modals
closeBtn.addEventListener('click', () => {
    resultDiv.style.display = 'none'; // Schließt das Modal
});

// Funktion, um einen zufälligen Namen zu wählen
function getRandomName(exclude) {
    const availableNames = participants.filter(name => name !== exclude);
    if (availableNames.length === 0) return null; // Keine verfügbaren Namen
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
}

// Event-Listener für die Briefe
letters.forEach(letter => {
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
            this.style.backgroundImage = "url('Brief offen.jfif')"; // Brief wird offen
            recipientName.textContent = recipient; // Name auf dem Modal anzeigen
            resultDiv.style.display = 'block'; // Modal anzeigen
            letters.forEach(l => {
                l.style.pointerEvents = 'none'; // Briefe nicht mehr klickbar machen
            });
        } else {
            alert("Es gibt keine verfügbaren Teilnehmer mehr.");
        }
    });
});
