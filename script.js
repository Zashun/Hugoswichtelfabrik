// Firebase SDK initialisieren
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";

// Deine Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyACPE3mLX_OkWr5dvfPzg7tv2C1rmB7pRo",
    authDomain: "wichteln-94d95.firebaseapp.com",
    databaseURL: "https://wichteln-94d95-default-rtdb.firebaseio.com",
    projectId: "wichteln-94d95",
    storageBucket: "wichteln-94d95.firebasestorage.app",
    messagingSenderId: "1075406306053",
    appId: "1:1075406306053:web:3dca41104574bd7be1156c",
    measurementId: "G-K40DJ2BM6H"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

// Funktion, um einen zufälligen Namen zu wählen
function getRandomName(exclude) {
    const availableNames = participants.filter(name => name !== exclude);
    if (availableNames.length === 0) return null; // Keine verfügbaren Namen
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
}

// Funktion, um den Ziehungsstatus vom Server abzurufen
function getDrawingStatus(participantId) {
    const dbRef = ref(database, 'draws/' + participantId);
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            // Name anzeigen, der bereits gezogen wurde
            openModal(snapshot.val().name);
            letters.forEach(l => {
                l.style.pointerEvents = 'none'; // Briefe nicht mehr klickbar machen
            });
        } else {
            // Ziehung noch nicht erfolgt
            drawNewName(participantId);
        }
    }).catch((error) => {
        console.error("Fehler beim Abrufen der Ziehungen: ", error);
    });
}

// Funktion, um einen neuen Namen zu ziehen und das Ergebnis zu speichern
function drawNewName(participantId) {
    const recipient = getRandomName(null);
    if (recipient) {
        assignedNames[participantId] = recipient;
        saveDrawing(participantId, recipient); // Ergebnis speichern
        openModal(recipient); // Modal mit Namen öffnen
    } else {
        alert("Es gibt keine verfügbaren Teilnehmer mehr.");
    }

    // Briefe nicht mehr klickbar machen
    letters.forEach(l => {
        l.style.pointerEvents = 'none';
    });
}

// Funktion, um den Namen des gezogenen Teilnehmers zu speichern
function saveDrawing(participantId, name) {
    set(ref(database, 'draws/' + participantId), {
        name: name
    });
}

// Event-Listener für die Briefe
letters.forEach((letter, index) => {
    letter.addEventListener('click', function() {
        const participantId = participants[index]; // ID basierend auf dem Namen
        getDrawingStatus(participantId); // Überprüfen und ggf. ziehen
    });
});

// Funktion, um das Modal zu öffnen
function openModal(recipient) {
    const modal = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    resultText.textContent = `Du hast ${recipient} gezogen!`;
    modal.style.display = 'block'; // Modal anzeigen
}

// Funktion, um das Modal zu schließen
document.getElementById('result').onclick = function() {
    this.style.display = 'none'; // Modal verstecken
};
