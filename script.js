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
function getDrawingStatus() {
    const dbRef = ref(database, 'drawings/');
    get(child(dbRef, 'participants')).then((snapshot) => {
        if (snapshot.exists()) {
            // Ziehungen vom Server abrufen
            const data = snapshot.val();
            for (let i = 0; i < letters.length; i++) {
                if (data[i]) {
                    assignedNames[i] = data[i]; // Name in assignedNames speichern
                    letters[i].textContent = data[i]; // Name auf dem Brief anzeigen
                    letters[i].style.pointerEvents = 'none'; // Brief nicht mehr klickbar
                }
            }
        }
    }).catch((error) => {
        console.error("Fehler beim Abrufen der Ziehungen: ", error);
    });
}

// Funktion, um den Namen des gezogenen Teilnehmers zu speichern
function saveDrawing(letterIndex, recipient) {
    const updates = {};
    updates[`drawings/participants/${letterIndex}`] = recipient;
    update(ref(database), updates);
}

// Event-Listener für die Briefe
letters.forEach((letter, index) => {
    letter.addEventListener('click', function() {
        // Überprüfen, ob der Brief schon geöffnet wurde
        if (assignedNames[index]) {
            alert("Dieser Brief wurde bereits geöffnet!");
            return;
        }

        // Zuweisung eines Namens
        const recipient = getRandomName(null);
        if (recipient) {
            assignedNames[index] = recipient;
            this.textContent = recipient; // Name auf dem Brief anzeigen
            saveDrawing(index, recipient); // Ziehung speichern
            openModal(recipient); // Modal mit Namen öffnen
        } else {
            alert("Es gibt keine verfügbaren Teilnehmer mehr.");
        }
        
        // Briefe nicht mehr klickbar machen
        letters.forEach(l => {
            l.style.pointerEvents = 'none';
        });
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

// Ziehungsstatus beim Laden der Seite abrufen
window.onload = getDrawingStatus;
