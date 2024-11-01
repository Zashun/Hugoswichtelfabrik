import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase Konfiguration
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Globale Variablen
let currentUser = null;
const names = [
    "Basti", "Julia", "Dirk", "Steh-Vieh", "Romy",
    "Christian", "Lina", "Moritz", "Sissi", "Bartosz",
    "David", "Monika", "Sascha", "Violetta", "Sammy",
    "Sven", "Angi", "Andrea"
];

// Funktion zur Generierung einer UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Funktion zur Generierung der Buchstaben
function generateLetters() {
    console.log("Buchstaben wurden generiert (Platzhalter).");
}

// Event-Listener für Briefe hinzufügen
function attachLetterEvents() {
    const letterElements = document.querySelectorAll('.letter'); // Angenommen, die Briefe haben die Klasse 'letter'
    letterElements.forEach(letterElement => {
        letterElement.addEventListener('click', () => {
            openLetter(letterElement, currentUser);
        });
    });
}

// Geladene Briefe abrufen
async function loadOpenedLetters() {
    try {
        const openedLettersRef = ref(db, 'openedLetters');
        const snapshot = await get(openedLettersRef);
        
        if (snapshot.exists()) {
            const openedLetters = snapshot.val();
            for (const [letterId, isOpened] of Object.entries(openedLetters)) {
                if (isOpened) {
                    const letterElement = document.querySelector(`.letter[data-index="${letterId}"]`);
                    if (letterElement) {
                        letterElement.classList.add('opened'); // Angenommen, 'opened' hebt den Brief hervor
                    }
                }
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden der geöffneten Briefe:", error);
    }
}

// DOM-Elemente
const userDropdown = document.getElementById('user-dropdown');
const confirmUserBtn = document.getElementById('confirm-user');
const userSelectionModal = document.getElementById('user-selection');
const lettersContainer = document.getElementById('letters-container');
const nameModal = document.getElementById('name-modal');
const partnerNameElement = document.getElementById('partner-name');
const closeNameModalBtn = document.querySelector('#name-modal .close');

// Benutzer zur Dropdown-Liste hinzufügen
async function populateDropdown() {
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        userDropdown.appendChild(option);
    });
}

// Benutzerauswahl prüfen
async function checkUserSelection(userName) {
    try {
        const userRef = ref(db, 'users/' + userName);
        const snapshot = await get(userRef);

        console.log('Benutzerreferenz:', userRef.toString());
        console.log('Snapshot existiert:', snapshot.exists());
        if (snapshot.exists()) {
            console.log('Daten im Snapshot:', snapshot.val());
        } else {
            console.log('Der Benutzer existiert nicht.');
        }

        return snapshot.exists() && snapshot.val().selected;
    } catch (error) {
        console.error("Fehler beim Prüfen der Benutzerauswahl:", error);
        return false;
    }
}

// Benutzer bestätigen
async function confirmUser() {
    const selectedUser = userDropdown.value;
    console.log('Ausgewählter Benutzer:', selectedUser);
    if (!selectedUser) {
        alert('Bitte wähle einen Namen');
        return;
    }

    try {
        const isSelected = await checkUserSelection(selectedUser);
        console.log('Ist ausgewählt:', isSelected);
        if (isSelected) {
            alert('Dieser Name wurde bereits ausgewählt');
            return;
        }

        const uuid = generateUUID();
        console.log('Generierte UUID:', uuid);
        const userRef = ref(db, 'users/' + selectedUser);

        await set(userRef, {
            uuid: uuid,
            selected: true,
            letterOpened: false
        });

        currentUser = selectedUser;
        userSelectionModal.style.display = 'none'; // Modal schließen
        
        await loadOpenedLetters();
    } catch (error) {
        console.error("Fehler beim Bestätigen des Benutzers:", error);
        alert('Es gab einen Fehler bei der Benutzerauswahl.');
    }
}

// Initialisierung der Datenbank
async function initializeDatabase() {
    try {
        const lettersRef = ref(db, 'letters');
        const snapshot = await get(lettersRef);
        
        if (!snapshot.exists()) {
            const shuffledNames = [...names].sort(() => Math.random() - 0.5);
            const assignments = {};
            
            names.forEach((name, index) => {
                let partnerIndex = (index + 1) % names.length;
                assignments[name] = shuffledNames[partnerIndex];
            });
            
            await set(lettersRef, assignments);
        }

        const openedLettersRef = ref(db, 'openedLetters');
        const openedSnapshot = await get(openedLettersRef);
        if (!openedSnapshot.exists()) {
            await set(openedLettersRef, {});
        }
    } catch (error) {
        console.error("Fehler bei der Datenbankinitialisierung:", error);
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
        
        if (!snapshot.exists()) {
            alert('Keine Zuordnungen gefunden!');
            return;
        }

        const assignments = snapshot.val();
        const partnerName = assignments[userName];

        if (partnerName) {
            letterElement.classList.add('opened');
            
            await update(ref(db, 'users/' + userName), {
                letterOpened: true,
                openedLetterId: letterElement.dataset.index
            });

            const openedLettersRef = ref(db, 'openedLetters');
            await update(openedLettersRef, {
                [letterElement.dataset.index]: true
            });

            partnerNameElement.textContent = partnerName;
            nameModal.style.display = 'block';
        }
    } catch (error) {
        console.error("Fehler beim Öffnen des Briefes:", error);
        alert('Es gab einen Fehler beim Öffnen des Briefes.');
    }
}

// Event Listener und Initialisierung
confirmUserBtn.addEventListener('click', confirmUser);
closeNameModalBtn.addEventListener('click', () => nameModal.style.display = 'none');

// Initialisierung
async function initialize() {
    try {
        await initializeDatabase();
        populateDropdown();
        generateLetters();
        await loadOpenedLetters();
        attachLetterEvents(); // Sicherstellen, dass Briefe nach dem Laden angehängt werden
    } catch (error) {
        console.error("Fehler bei der Initialisierung:", error);
    }
}

initialize();
