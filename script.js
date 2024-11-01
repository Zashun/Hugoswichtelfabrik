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

// Funktion, um einen Namen im Modal anzuzeigen
function showModal(name) {
    const modal = document.getElementById('modal');
    const resultText = document.getElementById('resultText');

    resultText.textContent = name; // Den Namen im Modal setzen
    modal.style.display = 'block'; // Modal anzeigen
}

// Event-Listener für die Briefe
letters.forEach(letter => {
    letter.addEventListener('click', async function() {
        const letterIndex = letters.indexOf(this);
        
        // Überprüfen, ob der Brief schon geöffnet wurde
        const response = await fetch('http://localhost:3000/drawings');
        const data = await response.json();
        if (data[letterIndex]) {
            alert("Dieser Brief wurde bereits geöffnet!");
            return;
        }

        // Zuweisung eines Namens
        const recipientResponse = await fetch('http://localhost:3000/draw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ letterIndex })
        });

        const recipientData = await recipientResponse.json();
        if (recipientResponse.ok) {
            this.style.backgroundImage = "url('Brief offen.jfif')"; // Ändere das Bild des Briefs
            showModal(recipientData.recipient); // Zeige das Modal mit dem Namen an
        } else {
            alert(recipientData.message); // Fehlermeldung anzeigen
        }
        
        // Briefe nicht mehr klickbar machen
        letters.forEach(l => {
            l.style.pointerEvents = 'none';
        });
    });
});

// Event-Listener für das Schließen des Modals
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
