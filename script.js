// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
    "Christian", "Lina", "Moritz", "Sissi", "Bartosz",
    "David", "Monika", "Sascha", "Violetta", "Sammy",
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

// Funktion für Ziehungen und Speicherung
function drawNewName() {
    const recipient = participants[Math.floor(Math.random() * participants.length)];
    saveDrawResult(recipient);
    openModal(recipient);
    letters.forEach(l => l.style.pointerEvents = 'none');
}

// Ergebnis speichern
function saveDrawResult(name) {
    set(ref(database, 'draws/' + deviceId), { name: name });
}

// Prüfen und Ziehen, wenn auf einen Brief geklickt wird
function checkOrDraw() {
    const dbRef = ref(database);
    get(child(dbRef, 'draws/' + deviceId)).then((snapshot) => {
        if (snapshot.exists()) {
            openModal(snapshot.val().name); // Bereits gezogener Name
        } else {
            drawNewName(); // Neuer Name
        }
    }).catch((error) => console.error("Fehler: ", error));
}

// Klick-Event für Briefe hinzufügen
letters.forEach(letter => {
    letter.addEventListener('click', checkOrDraw);
});
