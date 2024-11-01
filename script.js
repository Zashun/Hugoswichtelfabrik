// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
    databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
    projectId: "DEIN_PROJEKT_ID",
    storageBucket: "DEIN_PROJEKT_ID.appspot.com",
    messagingSenderId: "DEINE_SENDER_ID",
    appId: "DEINE_APP_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// UUID erstellen
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
              v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Bestätigungsbutton-Listener
document.getElementById('confirmButton').addEventListener('click', function() {
    const selectedUser = document.getElementById('userSelect').value;
    
    if (selectedUser) {
        const userUUID = generateUUID();
        const userRef = database.ref(`users/${selectedUser}`);
        
        // UUID und ausgewählte Flag setzen
        userRef.update({
            uuid: userUUID,
            selected: true
        }).then(() => {
            console.log(`UUID für ${selectedUser} in der Datenbank gespeichert: ${userUUID}`);
            // Hier kannst du das Popup oder andere Aktionen hinzufügen
        }).catch(error => {
            console.error("Fehler beim Speichern in der Datenbank:", error);
        });
    } else {
        alert("Bitte wähle einen Namen aus.");
    }
});
