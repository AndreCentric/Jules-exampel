# Jules Demo - Spring Boot REST API

Willkommen zur Jules Hands-on Demo! Diese Demo zeigt die Fähigkeiten von Jules als autonomer Software Engineer.

## Projektstruktur
- `examples/jules-demo/spring-boot-demo`: Die eigentliche Java-Anwendung.
- `scripts/demo-verify.sh`: Ein Hilfsskript zur Verifikation der laufenden App.
- `AGENTS.md`: Spezifische Anweisungen für Jules.

## Schnellstart
Um die Demo lokal zu starten und zu verifizieren:

1.  **Bauen und Testen:**
    ```bash
    cd examples/jules-demo/spring-boot-demo
    ./mvnw test
    ```

2.  **App starten:**
    ```bash
    ./mvnw spring-boot:run
    ```
    (Die App läuft standardmäßig auf Port 8080)

3.  **Verifizieren:**
    In einem neuen Terminal:
    ```bash
    bash scripts/demo-verify.sh
    ```

## Gezeigte Jules USPs
- **Autonomie:** Jules hat dieses Projekt komplett eigenständig aufgesetzt (Ordnerstruktur, Maven-Konfiguration, Code, Tests).
- **Reproduzierbarkeit:** Dank `AGENTS.md` und klarer Struktur kann Jules jederzeit Anpassungen vornehmen.
- **Integration:** Nutzung von Standard-Tools (Maven, Java 21).
