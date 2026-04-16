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

# Prüfe Demo Endpunkt
DEMO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/demo)

if [ "$DEMO_STATUS" -eq 200 ]; then
  echo "✅ /api/demo ist erreichbar (HTTP 200)"
  curl -s http://localhost:8080/api/demo | grep -q "features" && echo "  - Features werden zurückgegeben"
else
  echo "❌ /api/demo ist NICHT erreichbar (HTTP $DEMO_STATUS)"
  exit 1
fi

echo "Verifikation erfolgreich abgeschlossen!"
