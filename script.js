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
const briefContainer = document.getElementById('brief-container'); // Hier auf ID ändern
const namen = ["Basti", "Julia", "Dirk", "Steh-Vieh", "Romy", "Christian", "Lina", "Moritz", "Sissi", "Bartosz", "David", "Monika", "Sascha", "Violetta", "Sammy", "Sven", "Angi", "Andrea"];
const gezogen = [];

// Hilfsfunktion, um eine UUID zu generieren
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Briefe initialisieren
function loadBriefe() {
    for (let i = 0; i < namen.length; i++) {
        const brief = document.createElement('div');
        brief.classList.add('brief');
        brief.dataset.index = i;
        brief.addEventListener('click', () => zieheBrief(i));
        briefContainer.appendChild(brief);
    }
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
    gezogen.push(index);

    // Brief anzeigen und in der Datenbank speichern
    document.querySelector(`.brief[data-index="${index}"]`).classList.add('offen');
    await set(ref(db, `gezogen/${index}`), { uuid, name: gewaehlterName });
    
    alert(`Dein Wichtelpartner ist: ${gewaehlterName}`);
}

// Briefe laden
loadBriefe();
