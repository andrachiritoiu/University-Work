const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// servește fișiere statice (pentru a accesa fișierele HTML și CSS)
app.use(express.static(path.join(__dirname)));

// endpoint pentru a prelua datele din JSON
app.get('/minuni', function(req, res) {
    const filePath = path.join(__dirname, 'minuni.json'); // calea completă către fișierul JSON
    console.log('Calea către fișierul JSON:', filePath); // verifică calea fișierului

    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.error('Eroare la citirea fișierului JSON:', err);
            res.status(500).send('Eroare la citirea fișierului JSON');
            return;
        }
        res.json(JSON.parse(data)); // trimite datele JSON către client
    });
});

// servește fișierul HTML (pagina ta principală)
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'TEMA-minunile-lumii(1).html'));
});

// pornirea serverului
app.listen(port, function() {
    console.log('Serverul rulează pe http://localhost:' + port);
});
