// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const music = document.getElementById('Backgroundmusic');
music.volume = 0.2; // Lautstärke auf 20% setzen

// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyACPE3mLX_OkWr5dvfPzg7tv2C1rmB7pRo",
    authDomain: "wichteln-94d95.firebaseapp.com",
    databaseURL: "https://wichteln-94d95-default-rtdb.firebaseio.com",
    projectId: "wichteln-94d95",
    storageBucket: "wichteln-94d95.appspot.com",
    messagingSenderId: "1075406306053",
    appId: "1:1075406306053:web:3dca41104574bd7be1156c",
    measurementId: "G-K40DJ2BM6H"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Teilnehmerliste
const participants = [
    "Basti", "Julia", "Dirk", "Steh-Vieh", "Romy",
    "Christian", "Kai", "Sissi", "Bartosz", "Sascha", "Violetta", "Sammy",
    "Sven", "Angi", "Andrea"
];

const letters = Array.from(document.querySelectorAll('.letter'));

// Einzigartige Geräte-ID abrufen und speichern
const deviceId = localStorage.getItem("deviceId") || crypto.randomUUID();
localStorage.setItem("deviceId", deviceId);

// Modal-Logik
const modal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");
const closeModal = document.getElementById("closeModal");

function openModal(name) {
    resultText.textContent = `Du hast ${name} gezogen!`;
    modal.style.display = "block";
}

closeModal.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
};

// Bestehende gezogene Namen im Set speichern
const drawnNames = new Set();

// Ergebnis speichern
function saveDrawResult(name) {
    set(ref(database, 'draws/' + deviceId), { name: name })
        .then(() => {
            console.log(`Ergebnis gespeichert: ${name}`);
        })
        .catch((error) => {
            console.error("Fehler beim Speichern des Ergebnisses: ", error);
        });
}

// Funktion für Ziehungen und Speicherung
function drawNewName() {
    // Filter für verfügbare Namen
    const availableParticipants = participants.filter(name => !drawnNames.has(name));

    if (availableParticipants.length === 0) {
        alert("Alle Namen wurden bereits gezogen!");
        return;
    }

    const recipient = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
    drawnNames.add(recipient); // Hinzufügen des gezogenen Namens zum Set
    saveDrawResult(recipient);
    openModal(recipient);

    // Briefe ersetzen und Anzahl der verbleibenden Namen aktualisieren
    letters.forEach(letter => {
        if (letter.getAttribute('data-name') === recipient) {
            letter.style.backgroundImage = "url('Brief offen.png')"; // Brief ersetzen
        }
        letter.style.pointerEvents = 'none'; // Deaktiviert alle Briefe
    });

    updateRemainingCount(); // Anzahl der verbleibenden Namen aktualisieren
}

// Prüfen und Ziehen, wenn auf einen Brief geklickt wird
function checkOrDraw(letter) {
    const dbRef = ref(database);
    get(child(dbRef, 'draws/' + deviceId)).then((snapshot) => {
        if (snapshot.exists()) {
            openModal(snapshot.val().name); // Bereits gezogener Name
            drawnNames.add(snapshot.val().name); // Namen zum Set hinzufügen
            updateRemainingCount(); // Zähler aktualisieren
            console.log(`Bereits gezogener Name: ${snapshot.val().name}`);
        } else {
            drawNewName(); // Neuer Name ziehen
        }
    }).catch((error) => {
        console.error("Fehler: ", error);
    });
}

// Klick-Event für Briefe hinzufügen
letters.forEach(letter => {
    letter.addEventListener('click', () => checkOrDraw(letter));
});

// Funktion zum Aktualisieren der verbleibenden Namen
function updateRemainingCount() {
    const remaining = participants.length - drawnNames.size;
    document.getElementById("remainingCount").textContent = `Verbleibende Namen: ${remaining}`;
    console.log(`Verbleibende Namen: ${remaining}`);
}

// Alle bereits gezogenen Namen beim Laden der Seite abrufen
function initializeDrawnNames() {
    const dbRef = ref(database, 'draws/');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const drawnName = childSnapshot.val().name;
                drawnNames.add(drawnName); // Namen zum Set hinzufügen
            });
        }
        updateRemainingCount(); // Zähler aktualisieren
    }).catch((error) => {
        console.error("Fehler beim Abrufen der gezogenen Namen: ", error);
    });
}

// Beim Laden der Seite alle Namen abrufen
window.onload = () => {
    initializeDrawnNames(); // Bereits gezogene Namen abrufen
};
