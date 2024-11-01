import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase Konfiguration
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
const db = getDatabase(app);

// Globale Variablen
let currentUser = null;
const totalUsers = 18;
const names = [
    "Basti", "Julia", "Dirk", "Steh-Vieh", "Romy",
    "Christian", "Lina", "Moritz", "Sissi", "Bartosz",
    "David", "Monika", "Sascha", "Violetta", "Sammy",
    "Sven", "Angi", "Andrea"
];

// DOM-Elemente
const userDropdown = document.getElementById('user-dropdown');
const confirmUserBtn = document.getElementById('confirm-user');
const userSelectionModal = document.getElementById('user-selection');
const lettersContainer = document.getElementById('letters-container');
const nameModal = document.getElementById('name-modal');
const partnerNameElement = document.getElementById('partner-name');
const closeNameModalBtn = document.querySelector('#name-modal .close');

// Zeige das Benutzerauswahlmenü direkt an
window.onload = function() {
    userSelectionModal.style.display = 'block';
};

// Initialisiere die Datenbank beim ersten Laden
async function initializeDatabase() {
    try {
        const lettersRef = ref(db, 'letters');
        const snapshot = await get(lettersRef);
        
        if (!snapshot.exists()) {
            // Zufällige Zuordnung erstellen
            const shuffledNames = [...names].sort(() => Math.random() - 0.5);
            const assignments = {};
            
            names.forEach((name, index) => {
                let partnerIndex = (index + 1) % names.length;
                assignments[name] = shuffledNames[partnerIndex];
            });
            
            // In Firebase speichern
            await set(lettersRef, assignments);
        }
    } catch (error) {
        console.error("Fehler bei der Datenbankinitialisierung:", error);
    }
}

// Dropdown mit Namen füllen
function populateDropdown() {
    userDropdown.innerHTML = '<option value="">Bitte wählen</option>';
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        userDropdown.appendChild(option);
    });
}

// Briefe generieren
function generateLetters() {
    lettersContainer.innerHTML = '';
    for (let i = 0; i < totalUsers; i++) {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('letter');
        letterDiv.dataset.index = i;
        lettersContainer.appendChild(letterDiv);
    }
}

// UUID generieren
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Prüfen, ob Brief bereits geöffnet wurde
async function checkOpenedLetter(userName) {
    try {
        const userRef = ref(db, 'users/' + userName);
        const snapshot = await get(userRef);
        return snapshot.exists() && snapshot.val().letterOpened;
    } catch (error) {
        console.error("Fehler beim Prüfen des geöffneten Briefes:", error);
        return false;
    }
}

// Brief öffnen
async function openLetter(letterElement, userName) {
    try {
        const hasOpenedLetter = await checkOpenedLetter(userName);
        if (hasOpenedLetter) {
            alert('Du hast bereits einen Brief geöffnet!');
            return;
        }

        const lettersRef = ref(db, 'letters');
        const snapshot = await get(lettersRef);
        const assignments = snapshot.val();
        const partnerName = assignments[userName];

        if (partnerName) {
            letterElement.classList.add('opened');
            
            await update(ref(db, 'users/' + userName), {
                letterOpened: true,
                openedLetterId: letterElement.dataset.index
            });

            partnerNameElement.textContent = partnerName;
            nameModal.style.display = 'block';

            const openedLettersRef = ref(db, 'openedLetters');
            const openedSnapshot = await get(openedLettersRef);
            const openedLetters = openedSnapshot.val() || {};
            openedLetters[letterElement.dataset.index] = true;
            await set(openedLettersRef, openedLetters);
        }
    } catch (error) {
        console.error("Fehler beim Öffnen des Briefes:", error);
        alert('Es gab einen Fehler beim Öffnen des Briefes.');
    }
}

// Benutzer bestätigen
async function confirmUser() {
    const selectedUser = userDropdown.value;
    if (!selectedUser) {
        alert('Bitte wähle einen Namen');
        return;
    }

    try {
        const uuid = generateUUID();
        const userRef = ref(db, 'users/' + selectedUser);

        const snapshot = await get(userRef);
        if (snapshot.exists() && snapshot.val().selected) {
            alert('Dieser Name wurde bereits ausgewählt');
            return;
        }

        await set(userRef, {
            uuid: uuid,
            selected: true,
            letterOpened: false
        });

        currentUser = selectedUser;
        userSelectionModal.style.display = 'none';
        
        await loadOpenedLetters();
    } catch (error) {
        console.error("Fehler beim Bestätigen des Benutzers:", error);
        alert('Es gab einen Fehler bei der Benutzerauswahl.');
    }
}

// Bereits geöffnete Briefe laden
async function loadOpenedLetters() {
    try {
        const openedLettersRef = ref(db, 'openedLetters');
        const snapshot = await get(openedLettersRef);
        const openedLetters = snapshot.val() || {};

        Object.keys(openedLetters).forEach(index => {
            const letter = document.querySelector(`.letter[data-index="${index}"]`);
            if (letter) {
                letter.classList.add('opened');
            }
        });
    } catch (error) {
        console.error("Fehler beim Laden der geöffneten Briefe:", error);
    }
}

// Event Listener
confirmUserBtn.addEventListener('click', confirmUser);
closeNameModalBtn.addEventListener('click', () => {
    nameModal.style.display = 'none';
});

// Brief-Klick-Event
function attachLetterEvents() {
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
        letter.addEventListener('click', async () => {
            if (!currentUser) {
                alert('Bitte wähle zuerst deinen Namen aus!');
                return;
            }
            if (!letter.classList.contains('opened')) {
                await openLetter(letter, currentUser);
            }
        });
    });
}

// Initialisierung
async function initialize() {
    try {
        await initializeDatabase();
        populateDropdown();
        generateLetters();
        attachLetterEvents();
        await loadOpenedLetters();
    } catch (error) {
        console.error("Fehler bei der Initialisierung:", error);
    }
}

initialize();
