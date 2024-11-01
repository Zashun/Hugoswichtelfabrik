// Firebase konfigurieren
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update } from "firebase/database";

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

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const userSelect = document.getElementById("userSelect");
const confirmButton = document.getElementById("confirmButton");
const lettersContainer = document.getElementById("lettersContainer");
const namePopup = document.getElementById("namePopup");
const nameDisplay = document.getElementById("nameDisplay");
const closePopup = document.getElementById("closePopup");

// Benutzer auswählen und UUID generieren
confirmButton.addEventListener("click", () => {
    const selectedUser = userSelect.value;
    if (selectedUser) {
        checkIfUserSelected(selectedUser);
    } else {
        alert("Bitte wähle einen Namen aus.");
    }
});

function checkIfUserSelected(username) {
    const userRef = ref(database, `users/${username}`);
    get(userRef).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().uuid) {
            alert("Du hast bereits einen Namen gewählt.");
        } else {
            const uuid = generateUUID();
            update(userRef, { uuid: uuid, selected: true });
            displayLetters(username);
        }
    }).catch((error) => {
        console.error("Error getting user data:", error);
    });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Briefe anzeigen
function displayLetters(username) {
    const lettersRef = ref(database, 'letters');
    get(lettersRef).then((snapshot) => {
        if (snapshot.exists()) {
            lettersContainer.innerHTML = ''; // Bestehenden Inhalt leeren
            const letters = snapshot.val();
            for (const [user, recipient] of Object.entries(letters)) {
                const letterDiv = document.createElement('div');
                letterDiv.className = 'letter';
                letterDiv.style.backgroundImage = "url('Brief zu.png')";
                letterDiv.setAttribute('data-recipient', recipient);
                letterDiv.addEventListener('click', () => openLetter(recipient));
                lettersContainer.appendChild(letterDiv);
            }
        } else {
            console.log("Keine Briefe gefunden.");
        }
    }).catch((error) => {
        console.error("Error getting letters data:", error);
    });
}

// Brief öffnen
function openLetter(recipient) {
    nameDisplay.innerText = `Du musst ein Geschenk für: ${recipient}`;
    namePopup.style.display = 'block';
}

// Popup schließen
closePopup.addEventListener("click", () => {
    namePopup.style.display = 'none';
});

// CSS anpassen
const style = document.createElement('style');
style.innerHTML = `
    .letter {
        width: 100px;
        height: 150px;
        margin: 10px;
        background-size: cover;
        display: inline-block;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .letter:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
