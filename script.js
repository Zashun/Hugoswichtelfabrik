import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

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

const letters = document.getElementById('letters');
const confirmButton = document.getElementById('confirmButton');
const userSelect = document.getElementById('userSelect');
const nameModal = document.getElementById('nameModal');
const nameDisplay = document.getElementById('nameDisplay');
const closeModal = document.getElementById('closeModal');

const users = [
    "Basti", "Julia", "Dirk", "Steh-Vieh", "Romy",
    "Christian", "Lina", "Moritz", "Sissi", "Bartosz",
    "David", "Monika", "Sascha", "Violetta", "Sammy",
    "Sven", "Angi", "Andrea"
];

users.forEach((user, index) => {
    const letter = document.createElement('div');
    letter.className = 'letter';
    letter.id = `letter_${index}`;
    letter.style.backgroundImage = "url('Brief zu.png')";
    letter.addEventListener('click', () => openLetter(user, index));
    letters.appendChild(letter);
});

confirmButton.addEventListener('click', () => {
    const selectedUser = userSelect.value;
    if (selectedUser) {
        const uuid = generateUUID();
        saveUserToDB(selectedUser, uuid);
    }
});

function openLetter(user, index) {
    const letter = document.getElementById(`letter_${index}`);
    letter.style.backgroundImage = "url('Brief auf.png')";
    nameDisplay.innerText = user;
    nameModal.style.display = "block";
}

closeModal.onclick = function() {
    nameModal.style.display = "none";
};

function saveUserToDB(user, uuid) {
    set(ref(db, 'users/' + uuid), {
        name: user,
        opened: true
    });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Firebase-Datenbank-Listener
onValue(ref(db, 'users'), (snapshot) => {
    const data = snapshot.val();
    console.log(data); // Hier kannst du das Datenhandling implementieren
});
