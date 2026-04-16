package com.example.demo.service;

import com.example.demo.domain.AuditLogEntry;
import com.example.demo.domain.CarSharingBooking;
import com.example.demo.domain.BookingStatus;
import com.example.demo.exception.InvalidStateTransitionException;
import com.example.demo.repository.AuditLogRepository;
import com.example.demo.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private BookingService bookingService;

    private CarSharingBooking booking;

    @BeforeEach
    void setUp() {
        booking = CarSharingBooking.builder()
                .id(1L)
                .carId("VW-ID3-001")
                .userId("user_123")
                .status(BookingStatus.REQUESTED)
                .build();
    }

    @Test
    void testValidTransition() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any())).thenReturn(booking);

        CarSharingBooking updated = bookingService.updateStatus(1L, BookingStatus.ACTIVE);

        assertEquals(BookingStatus.ACTIVE, updated.getStatus());
        verify(auditLogRepository, times(1)).save(any(AuditLogEntry.class));
    }

    @Test
    void testInvalidTransition() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        assertThrows(InvalidStateTransitionException.class, () -> {
            bookingService.updateStatus(1L, BookingStatus.COMPLETED);
        });

        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void testRepeatedStatusUpdate() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        CarSharingBooking updated = bookingService.updateStatus(1L, BookingStatus.REQUESTED);

        assertEquals(BookingStatus.REQUESTED, updated.getStatus());
        verify(bookingRepository, never()).save(any());
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void testAuditLogCreation() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any())).thenReturn(booking);

        bookingService.updateStatus(1L, BookingStatus.ACTIVE);

        verify(auditLogRepository).save(argThat(log ->
            log.getEntityId().equals(1L) &&
            log.getOldStatus().equals(BookingStatus.REQUESTED.name()) &&
            log.getNewStatus().equals(BookingStatus.ACTIVE.name())
        ));
    }
}
