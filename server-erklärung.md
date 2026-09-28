cat << 'EOF' > server-erklaerung.md
# Spickzettel: Wie funktioniert die server.js?

## 1. Werkzeuge laden (require)
Die ersten Zeilen laden die Module. Node.js importiert `http` für das Netzwerk, `fs` zum Lesen der HTML-Datei, `path` für korrekte Ordnerpfade und `mongoose` als Übersetzer für die MongoDB-Datenbank.

## 2. Datenbank-Verbindung
`mongoose.connect()` baut die Brücke zum Datenbank-Container über den Namen `mein-datenbank-container`. `.then()` meldet Erfolg, `.catch()` fängt Abstürze ab.

## 3. Das Daten-Schema
`mongoose.Schema` bestimmt das Tabellen-Format. Es legt fest, dass jeder Eintrag zwingend aus einem `name` (Text) und einer `anzahl` (Zahl) bestehen muss.

## 4. Der Detektiv (getZaehlerFuerName)
Diese Suchfunktion schaut mit `KlickModell.findOne()` in der MongoDB nach, ob das Profil des Users (z. B. Max) existiert. Wenn nicht, legt `new KlickModell()` automatisch ein neues Profil mit 0 Klicks an.

## 5. Die Weichen (Das Routing)
`http.createServer()` wartet auf Browser-Anfragen. Es filtert den Namen aus der URL (`?name=Max`) und schaltet auf die passende Weiche:
* **`/bootstrap.css`**: Liefert das lokale Design aus.
* **`/api/klicks` (GET)**: Holt die Klickzahl aus der MongoDB und zeigt sie an.
* **`/api/klick-erhoehen` (POST)**: Rechnet in der Datenbank +1 und speichert.
* **`/api/klick-reset` (POST)**: Setzt den Zähler in der Datenbank knallhart auf 0.
* **`/` (Startseite)**: Liest die `index.html` ein und baut die Website im Browser auf.

## 6. Der Startknopf
`server.listen(3000)` schaltet den Server auf Port 3000 scharf.
EOF
