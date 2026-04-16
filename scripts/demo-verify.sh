#!/bin/bash

# Jules Demo Verifikationsskript

echo "Starte Verifikation der Jules Demo App..."

# Prüfe Health Endpunkt
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health)

if [ "$HEALTH_STATUS" -eq 200 ]; then
  echo "✅ /api/health ist erreichbar (HTTP 200)"
  curl -s http://localhost:8080/api/health | grep -q "UP" && echo "  - Status ist UP"
else
  echo "❌ /api/health ist NICHT erreichbar (HTTP $HEALTH_STATUS)"
  exit 1
fi

# Prüfe Car Sharing Buchungen (Beispieldaten sollten vorhanden sein)
BOOKING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/bookings/1)

if [ "$BOOKING_STATUS" -eq 200 ]; then
  echo "✅ /api/bookings/1 ist erreichbar (HTTP 200)"
  curl -s http://localhost:8080/api/bookings/1 | grep -q "carId" && echo "  - Buchungsdaten vorhanden"
else
  echo "❌ /api/bookings/1 ist NICHT erreichbar (HTTP $BOOKING_STATUS)"
  exit 1
fi

echo "Verifikation erfolgreich abgeschlossen!"
