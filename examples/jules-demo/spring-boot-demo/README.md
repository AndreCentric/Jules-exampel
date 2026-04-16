# Charging Status Workflow Demo

Diese Demo implementiert einen Workflow für den Status von Autoladevorgängen.

## Zustandsübergänge

Folgende Übergänge sind erlaubt:
- `AVAILABLE` -> `CHARGING`, `ERROR`
- `CHARGING` -> `FINISHED`, `ERROR`
- `FINISHED` -> `AVAILABLE`
- `ERROR` -> `AVAILABLE`

## Features
- Validierung von Zustandsübergängen.
- Audit-Logging für jede erfolgreiche Statusänderung.
- Zentrale Fehlerbehandlung mit aussagekräftigen Meldungen.

## API Endpunkte & CURL Beispiele

### 1. Eine neue Ladesession erstellen
```bash
curl -X POST http://localhost:8080/api/charging/sessions \
-H "Content-Type: application/json" \
-d '{"chargerId": "CHARGER-001"}'
```

### 2. Status einer Session abrufen
```bash
curl -X GET http://localhost:8080/api/charging/sessions/1
```

### 3. Status einer Session aktualisieren (Valider Übergang)
```bash
curl -X PATCH http://localhost:8080/api/charging/sessions/1/status \
-H "Content-Type: application/json" \
-d '{"status": "CHARGING"}'
```

### 4. Status einer Session aktualisieren (Invalider Übergang)
Wenn der aktuelle Status `AVAILABLE` ist, ist ein Übergang zu `FINISHED` ungültig:
```bash
curl -X PATCH http://localhost:8080/api/charging/sessions/1/status \
-H "Content-Type: application/json" \
-d '{"status": "FINISHED"}'
```
**Antwort:** `400 Bad Request` mit Nachricht: `Invalid transition from AVAILABLE to FINISHED`

### 5. Nicht existierende Session abrufen
```bash
curl -X GET http://localhost:8080/api/charging/sessions/999
```
**Antwort:** `404 Not Found` mit Nachricht: `ChargingSession with id 999 not found`

## Tests ausführen
```bash
./mvnw test
```
