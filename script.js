// Firebase Initialisierung (deine Firebase-Konfiguration hier einfügen)
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
const database = getDatabase(app);

const lettersContainer = document.getElementById('lettersContainer');
const namePopup = document.getElementById('namePopup');
const nameDisplay = document.getElementById('nameDisplay');
const closePopup = document.getElementById('closePopup');
const confirmButton = document.getElementById('confirmButton');
const userSelect = document.getElementById('userSelect');

let userUUID = null;

// Funktion zur Generierung einer UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Briefe laden und anzeigen
function loadLetters() {
    database.ref('letters').once('value').then(snapshot => {
        const letters = snapshot.val();
        for (let key in letters) {
            const letterDiv = document.createElement('div');
            letterDiv.classList.add('letter');
            letterDiv.style.backgroundImage = "url('Brief zu.png')";
            letterDiv.dataset.key = key; // Speichern des Schlüssels für später
            letterDiv.addEventListener('click', () => openLetter(key, letters[key].name));
            lettersContainer.appendChild(letterDiv);
        }
    });
}

// Brief öffnen
function openLetter(letterKey, chosenName) {
    // Popup anzeigen
    nameDisplay.textContent = chosenName;
    namePopup.style.display = "block";

    // Update in der Datenbank
    database.ref('letters/' + letterKey + '/openedBy').push(userUUID);

    // Briefe im Container aktualisieren
    const letterDivs = document.querySelectorAll('.letter');
    letterDivs.forEach(div => {
        if (div.dataset.key === letterKey) {
            div.style.backgroundImage = "url('Brief auf.png')"; // Geöffnetes Bild anzeigen
        }
    });
}

// Ereignisse
confirmButton.addEventListener('click', () => {
    if (userSelect.value) {
        if (!userUUID) {
            userUUID = generateUUID(); // UUID generieren, wenn noch nicht vorhanden
            // UUID in der Datenbank speichern
            database.ref('users/' + userUUID).set({
                name: userSelect.value
            });
        }
        loadLetters(); // Briefe laden, wenn ein Benutzer ausgewählt wurde
    } else {
        alert('Bitte wähle einen Namen.');
    }
});

closePopup.addEventListener('click', () => {
    namePopup.style.display = "none"; // Popup schließen
});

// Starten der Anwendung
loadLetters();
