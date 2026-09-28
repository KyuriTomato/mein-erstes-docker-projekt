const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 1. Verbindung zur MongoDB
mongoose.connect('mongodb://mein-datenbank-container:27017/klickDB')
  .then(() => console.log('Erfolgreich mit MongoDB verbunden!'))
  .catch(err => console.error('Datenbank-Verbindungsfehler:', err));

// 2. ERWEITERTES SCHEMA: Wir speichern jetzt Name UND Anzahl
const KlickSchema = new mongoose.Schema({
    name: { type: String, default: 'Gast' },
    anzahl: { type: Number, default: 0 }
});
const KlickModell = mongoose.model('Klick', KlickSchema);

// Hilfsfunktion: Holt den Datensatz für einen bestimmten Namen oder erstellt ihn neu
async function getZaehlerFuerName(nutzerName) {
    let nameGereinigt = nutzerName ? nutzerName.trim() : 'Gast';
    if (nameGereinigt === '') nameGereinigt = 'Gast';
    
    let datensatz = await KlickModell.findOne({ name: nameGereinigt });
    if (!datensatz) {
        datensatz = new KlickModell({ name: nameGereinigt, anzahl: 0 });
        await datensatz.save();
    }
    return datensatz;
}

const server = http.createServer(async (req, res) => {
    // ROUTE 1: Bootstrap ausliefern
    if (req.url === '/bootstrap.css') {
        const bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css');
        fs.readFile(bootstrapPath, (err, data) => {
            if (err) { res.writeHead(404); res.end(); return; }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(data);
        });
        return;
    }

    // URL analysieren, um den Namen aus den Parametern zu lesen (z.B. /api/klicks?name=Max)
    const baseUrl = 'http://' + req.headers.host;
    const parsedUrl = new URL(req.url, baseUrl);
    const nutzerName = parsedUrl.searchParams.get('name') || 'Gast';

    // ROUTE 2: API – Zählerstand für einen bestimmten Namen holen
    if (parsedUrl.pathname === '/api/klicks' && req.method === 'GET') {
        const datensatz = await getZaehlerFuerName(nutzerName);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ name: datensatz.name, anzahl: datensatz.anzahl }));
        return;
    }

    // ROUTE 3: API – Klick für diesen Namen erhöhen
    if (parsedUrl.pathname === '/api/klick-erhoehen' && req.method === 'POST') {
        const datensatz = await getZaehlerFuerName(nutzerName);
        datensatz.anzahl += 1;
        await datensatz.save();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ name: datensatz.name, anzahl: datensatz.anzahl }));
        return;
    }

    // ROUTE 4: API – Klicks für diesen Namen zurücksetzen
    if (parsedUrl.pathname === '/api/klick-reset' && req.method === 'POST') {
        const datensatz = await getZaehlerFuerName(nutzerName);
        datensatz.anzahl = 0;
        await datensatz.save();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ name: datensatz.name, anzahl: datensatz.anzahl }));
        return;
    }

    // ROUTE 5: Die normale index.html ausliefern
    if (req.url === '/' || req.url.startsWith('/index.html')) {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) { res.writeHead(500); res.end('Fehler'); return; }
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(data);
        });
        return;
    }
});

server.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});
