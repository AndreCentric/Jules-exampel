package com.example.demo.service;

import com.example.demo.domain.AuditLogEntry;
import com.example.demo.domain.ChargingSession;
import com.example.demo.domain.ChargingStatus;
import com.example.demo.exception.InvalidStateTransitionException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AuditLogRepository;
import com.example.demo.repository.ChargingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChargingService {

    private final ChargingSessionRepository sessionRepository;
    private final AuditLogRepository auditLogRepository;

    private static final Map<ChargingStatus, Set<ChargingStatus>> VALID_TRANSITIONS = new HashMap<>();

    static {
        VALID_TRANSITIONS.put(ChargingStatus.AVAILABLE, EnumSet.of(ChargingStatus.CHARGING, ChargingStatus.ERROR));
        VALID_TRANSITIONS.put(ChargingStatus.CHARGING, EnumSet.of(ChargingStatus.FINISHED, ChargingStatus.ERROR));
        VALID_TRANSITIONS.put(ChargingStatus.FINISHED, EnumSet.of(ChargingStatus.AVAILABLE));
        VALID_TRANSITIONS.put(ChargingStatus.ERROR, EnumSet.of(ChargingStatus.AVAILABLE));
    }

    public ChargingSession createSession(String chargerId) {
        ChargingSession session = ChargingSession.builder()
                .chargerId(chargerId)
                .status(ChargingStatus.AVAILABLE)
                .build();
        return sessionRepository.save(session);
    }

    @Transactional
    public ChargingSession updateStatus(Long sessionId, ChargingStatus newStatus) {
        ChargingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ChargingSession with id " + sessionId + " not found"));

        ChargingStatus oldStatus = session.getStatus();

        if (oldStatus == newStatus) {
            return session; // No change needed, or could throw exception if desired. Requirements say edge case "repeated status updates"
        }

        if (!isValidTransition(oldStatus, newStatus)) {
            throw new InvalidStateTransitionException(
                    String.format("Invalid transition from %s to %s", oldStatus, newStatus));
        }

        session.setStatus(newStatus);
        ChargingSession updatedSession = sessionRepository.save(session);

        AuditLogEntry auditLog = AuditLogEntry.builder()
                .sessionId(sessionId)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);

        return updatedSession;
    }

    private boolean isValidTransition(ChargingStatus from, ChargingStatus to) {
        Set<ChargingStatus> allowed = VALID_TRANSITIONS.get(from);
        return allowed != null && allowed.contains(to);
    }

    public ChargingSession getSession(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ChargingSession with id " + sessionId + " not found"));
    }
}
