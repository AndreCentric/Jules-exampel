# Car Sharing Booking Workflow Demo

Diese Demo implementiert einen Workflow für den Status von Car-Sharing Buchungen.

## Zustandsübergänge

Folgende Übergänge sind erlaubt:
- `REQUESTED` -> `ACTIVE` (Buchung starten)
- `REQUESTED` -> `CANCELLED` (Buchung stornieren)
- `ACTIVE` -> `COMPLETED` (Fahrzeug zurückgeben)

## Features
- Validierung von Zustandsübergängen.
- Audit-Logging für jede erfolgreiche Statusänderung.
- Zentrale Fehlerbehandlung mit aussagekräftigen Meldungen.
- Automatisches Setzen von Endzeiten bei Abschluss.
- Initialisierung mit Beispieldaten.

## API Endpunkte & CURL Beispiele

### 1. Eine neue Buchung erstellen
```bash
curl -X POST http://localhost:8080/api/bookings \
-H "Content-Type: application/json" \
-d '{"carId": "VW-ID3-001", "userId": "user_123"}'
```

### 2. Status einer Buchung abrufen
```bash
curl -X GET http://localhost:8080/api/bookings/1
```

### 3. Status einer Buchung aktualisieren (Valider Übergang)
```bash
curl -X PATCH http://localhost:8080/api/bookings/1/status \
-H "Content-Type: application/json" \
-d '{"status": "ACTIVE"}'
```

### 4. Status einer Buchung aktualisieren (Invalider Übergang)
Wenn der aktuelle Status `REQUESTED` ist, ist ein direkter Übergang zu `COMPLETED` ungültig:
```bash
curl -X PATCH http://localhost:8080/api/bookings/1/status \
-H "Content-Type: application/json" \
-d '{"status": "COMPLETED"}'
```
**Antwort:** `400 Bad Request` mit Nachricht: `Invalid transition from REQUESTED to COMPLETED`

### 5. Nicht existierende Buchung abrufen
```bash
curl -X GET http://localhost:8080/api/bookings/999
```
**Antwort:** `404 Not Found` mit Nachricht: `Booking with id 999 not found`

## Tests ausführen
```bash
./mvnw test
```
