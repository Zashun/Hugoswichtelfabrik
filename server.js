// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let assignedNames = {}; // Dieses Objekt speichert die zugewiesenen Namen

// Endpoint zum Ziehen eines Namens
app.post('/draw', (req, res) => {
    const { letterIndex } = req.body;
    if (assignedNames[letterIndex]) {
        return res.status(400).json({ message: "Dieser Brief wurde bereits gezogen!" });
    }
    
    const availableNames = ["Basti", "Julia", "Dirk", "Steh-Vieh", "Romy", 
        "Christian", "Lina", "Moritz", "Sissi", "Bartosz", 
        "David", "Monika", "Sascha", "Violetta", "Sammy", 
        "Sven", "Angi", "Andrea"];
    
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const recipient = availableNames[randomIndex];
    
    assignedNames[letterIndex] = recipient; // Zuweisung des Namens
    return res.json({ recipient });
});

// Endpoint zum Abrufen der Ziehungen
app.get('/drawings', (req, res) => {
    res.json(assignedNames);
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
