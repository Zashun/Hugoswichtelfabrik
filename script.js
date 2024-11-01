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

// Überprüfen, ob es bereits gezogene Namen gibt und die Namen aus localStorage laden
const loadedNames = JSON.parse(localStorage.getItem('assignedNames')) || {};
Object.assign(assignedNames, loadedNames);

// Funktion, um einen zufälligen Namen zu wählen
function getRandomName() {
    const availableNames = participants.filter(name => !Object.values(assignedNames).includes(name));
    if (availableNames.length === 0) return null; // Keine verfügbaren Namen
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
}

// Event-Listener für die Briefe
letters.forEach((letter, index) => {
    // Überprüfen, ob der Brief bereits zugewiesen wurde
    if (assignedNames[index]) {
        letter.textContent = assignedNames[index]; // Name auf dem Brief anzeigen
        letter.style.pointerEvents = 'none'; // Briefe nicht mehr klickbar machen
    }

    letter.addEventListener('click', function() {
        // Überprüfen, ob der Brief schon geöffnet wurde
        if (assignedNames[index]) {
            alert("Dieser Brief wurde bereits geöffnet!");
            return;
        }

        // Zuweisung eines Namens
        const recipient = getRandomName();
        if (recipient) {
            assignedNames[index] = recipient;
            this.textContent = recipient; // Name auf dem Brief anzeigen
            alert(`Du hast ${recipient} gezogen!`); // Nachricht an den Nutzer
            
            // Speichern der zugewiesenen Namen im localStorage
            localStorage.setItem('assignedNames', JSON.stringify(assignedNames));
        } else {
            alert("Es gibt keine verfügbaren Teilnehmer mehr.");
        }
        
        // Briefe nicht mehr klickbar machen
        letters.forEach(l => {
            l.style.pointerEvents = 'none';
        });
    });
});
