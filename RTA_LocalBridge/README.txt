RTA Local Bridge 0.2

VORAUSSETZUNG:
- Node.js muss auf Windows installiert sein.
- Kein npm install nötig; der Dienst verwendet nur eingebaute Node.js-Module.

START:
1. Den gesamten Ordner RTA_0.2_Direktverbindung entpacken.
2. RTA_LocalBridge\RTA_Starten.bat doppelklicken.
3. Das schwarze Konsolenfenster geöffnet lassen.
4. Die TestApp öffnet sich unter http://127.0.0.1:8765.

VERBINDUNG:
- In Opera GX die aktualisierte RTA-Erweiterung aus dem Ordner RTA_Extension laden.
- RollerCoin-Taskwall öffnen.
- Erweiterung öffnen und "Taskwall scannen" klicken.
- Danach "An RTA TestApp senden" klicken.
- Die TestApp übernimmt den Scan automatisch innerhalb von ca. 2 Sekunden.

SICHERHEIT:
- Der lokale Dienst bindet ausschließlich an 127.0.0.1 (dein eigener PC).
- Keine Cloud, kein externer Server, keine API-Kosten.
- Er speichert nur den letzten Scan als latest-scan.json.
- Der Dienst führt keine RollerCoin-Aktionen aus und sendet keine Zugangsdaten.
- Beende den Dienst mit Strg+C im Konsolenfenster.
