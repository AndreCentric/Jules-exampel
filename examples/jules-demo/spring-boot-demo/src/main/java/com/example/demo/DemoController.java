package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DemoController {

    // JULES-DEMO: Ein einfacher Health-Endpunkt für Monitoring und Verifikation.
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Jules Demo App is running smoothly");
        return status;
    }

    // JULES-DEMO: Dieser Endpunkt zeigt Jules-spezifische USPs.
    @GetMapping("/demo")
    public Map<String, Object> demo() {
        Map<String, Object> response = new HashMap<>();
        response.put("demo", "Jules Hands-on");
        response.put("features", new String[]{
            "Autonomie: Jules arbeitet Aufgaben selbstständig ab",
            "Reproduzierbarkeit: Klare Anweisungen in AGENTS.md",
            "Orchestrierung: Jules nutzt Tools wie Maven, Shell-Skripte und Git",
            "Integration: Nahtlose GitHub-Anbindung"
        });
        response.put("status", "Success");

        // TODO(jules-demo): Hier könnte eine komplexere Business-Logik implementiert werden

        return response;
    }
}
