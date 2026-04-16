# Jules Demo: Spring Boot Anwendung

Diese Dokumentation beschreibt die Arbeit mit der Jules Demo App.

## Befehle für Jules

- **App bauen:** `cd examples/jules-demo/spring-boot-demo && ./mvnw clean package`
- **Tests ausführen:** `cd examples/jules-demo/spring-boot-demo && ./mvnw test`
- **App starten:** `cd examples/jules-demo/spring-boot-demo && ./mvnw spring-boot:run`
- **Verifikation:** `bash scripts/demo-verify.sh`

## JULES-DEMO Marker
Im Code findest du Kommentare mit dem Präfix `JULES-DEMO:`. Diese markieren Stellen, die besonders gut geeignet sind, um die Funktionsweise von Jules zu erklären.

## Programmatische Checks
Nach Änderungen an der API müssen die Tests erfolgreich durchlaufen.
