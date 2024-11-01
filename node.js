const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const participants = [
    "Basti", "Julia", "Dirk", "Steh-Vieh", "Romy", 
    "Christian", "Lina", "Moritz", "Sissi", "Bartosz", 
    "David", "Monika", "Sascha", "Violetta", "Sammy", 
    "Sven", "Angi", "Andrea"
];

let drawnNames = new Set(); // Um bereits gezogene Namen zu speichern

app.post('/draw', (req, res) => {
    const { letterIndex } = req.body;

    // Überprüfen, ob die Ziehung möglich ist
    if (drawnNames.size >= participants.length) {
        return res.status(400).json({ message: "Alle Teilnehmer haben bereits gezogen." });
    }

    let recipient;
    do {
        const randomIndex = Math.floor(Math.random() * participants.length);
        recipient = participants[randomIndex];
    } while (drawnNames.has(recipient)); // Sicherstellen, dass der Name nicht schon gezogen wurde

    drawnNames.add(recipient); // Namen speichern
    res.json({ recipient });
});

app.get('/drawings', (req, res) => {
    // Zurückgeben der bereits gezogenen Namen
    const result = Array.from(drawnNames);
    res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
