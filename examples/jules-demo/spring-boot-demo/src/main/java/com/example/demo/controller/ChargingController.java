package com.example.demo.controller;

import com.example.demo.domain.ChargingSession;
import com.example.demo.dto.CreateSessionRequest;
import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.service.ChargingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/charging")
@RequiredArgsConstructor
public class ChargingController {

    private final ChargingService chargingService;

    @PostMapping("/sessions")
    public ResponseEntity<ChargingSession> createSession(@RequestBody CreateSessionRequest request) {
        return ResponseEntity.ok(chargingService.createSession(request.getChargerId()));
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<ChargingSession> getSession(@PathVariable Long id) {
        return ResponseEntity.ok(chargingService.getSession(id));
    }

    @PatchMapping("/sessions/{id}/status")
    public ResponseEntity<ChargingSession> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(chargingService.updateStatus(id, request.getStatus()));
    }
}
