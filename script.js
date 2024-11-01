// Firebase Konfiguration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const uuid = generateUUID();
const briefContainer = document.getElementById('brief-container');
const namen = ["Basti", "Julia", "Dirk", "Steh-Vieh", "Romy", "Christian", "Lina", "Moritz", "Sissi", "Bartosz", "David", "Monika", "Sascha", "Violetta", "Sammy", "Sven", "Angi", "Andrea"];
const MIN_DISTANCE = 120;

// Hilfsfunktion, um eine UUID zu generieren
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Briefe initialisieren und zufällig platzieren
function loadBriefe() {
    const briefPositions = [];
    
    for (let i = 0; i < namen.length; i++) {
        const brief = document.createElement("div");
        brief.classList.add("brief", "brief-zu");
        brief.dataset.index = i;

        // Zufällige, nicht überlappende Position finden
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * (briefContainer.offsetWidth - 100)),
                y: Math.floor(Math.random() * (briefContainer.offsetHeight - 100))
            };
        } while (!isPositionValid(position, briefPositions));

        brief.style.left = `${position.x}px`;
        brief.style.top = `${position.y}px`;
        briefPositions.push(position);

        brief.addEventListener("click", () => zieheBrief(i));
        briefContainer.appendChild(brief);
    }
}

// Funktion zur Überprüfung, ob eine Position ohne Überlappung gültig ist
function isPositionValid(position, positions) {
    return positions.every(pos => {
        const dx = pos.x - position.x;
        const dy = pos.y - position.y;
        return Math.sqrt(dx * dx + dy * dy) >= MIN_DISTANCE;
    });
}

// Prüfen und Ziehen des Briefs
async function zieheBrief(index) {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `gezogen/${index}`));

    if (snapshot.exists()) {
        alert("Dieser Brief wurde schon gezogen.");
        return;
    }

    const gewaehlterName = namen[index];

    // Brief anzeigen und in der Datenbank speichern
    document.querySelector(`.brief[data-index="${index}"]`).classList.remove('brief-zu');
    document.querySelector(`.brief[data-index="${index}"]`).classList.add('brief-offen');
    await set(ref(db, `gezogen/${index}`), { uuid, name: gewaehlterName });

    alert(`Dein Wichtelpartner ist: ${gewaehlterName}`);
}

// Lädt die Briefe, sobald die Seite geladen ist
document.addEventListener("DOMContentLoaded", loadBriefe);
