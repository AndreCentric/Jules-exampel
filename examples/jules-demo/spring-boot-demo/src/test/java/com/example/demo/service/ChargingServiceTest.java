package com.example.demo.service;

import com.example.demo.domain.AuditLogEntry;
import com.example.demo.domain.ChargingSession;
import com.example.demo.domain.ChargingStatus;
import com.example.demo.exception.InvalidStateTransitionException;
import com.example.demo.repository.AuditLogRepository;
import com.example.demo.repository.ChargingSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChargingServiceTest {

    @Mock
    private ChargingSessionRepository sessionRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private ChargingService chargingService;

    private ChargingSession session;

    @BeforeEach
    void setUp() {
        session = ChargingSession.builder()
                .id(1L)
                .chargerId("TEST-01")
                .status(ChargingStatus.AVAILABLE)
                .build();
    }

    @Test
    void testValidTransition() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any())).thenReturn(session);

        ChargingSession updated = chargingService.updateStatus(1L, ChargingStatus.CHARGING);

        assertEquals(ChargingStatus.CHARGING, updated.getStatus());
        verify(auditLogRepository, times(1)).save(any(AuditLogEntry.class));
    }

    @Test
    void testInvalidTransition() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThrows(InvalidStateTransitionException.class, () -> {
            chargingService.updateStatus(1L, ChargingStatus.FINISHED);
        });

        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void testRepeatedStatusUpdate() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        ChargingSession updated = chargingService.updateStatus(1L, ChargingStatus.AVAILABLE);

        assertEquals(ChargingStatus.AVAILABLE, updated.getStatus());
        verify(sessionRepository, never()).save(any());
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void testAuditLogCreation() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any())).thenReturn(session);

        chargingService.updateStatus(1L, ChargingStatus.CHARGING);

        verify(auditLogRepository).save(argThat(log ->
            log.getSessionId().equals(1L) &&
            log.getOldStatus() == ChargingStatus.AVAILABLE &&
            log.getNewStatus() == ChargingStatus.CHARGING
        ));
    }
}
