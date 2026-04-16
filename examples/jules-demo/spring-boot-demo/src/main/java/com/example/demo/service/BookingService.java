package com.example.demo.service;

import com.example.demo.domain.AuditLogEntry;
import com.example.demo.domain.CarSharingBooking;
import com.example.demo.domain.BookingStatus;
import com.example.demo.exception.InvalidStateTransitionException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.AuditLogRepository;
import com.example.demo.repository.BookingRepository;
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
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AuditLogRepository auditLogRepository;

    private static final Map<BookingStatus, Set<BookingStatus>> VALID_TRANSITIONS = new HashMap<>();

    static {
        // REQUESTED -> ACTIVE (start booking) or CANCELLED
        VALID_TRANSITIONS.put(BookingStatus.REQUESTED, EnumSet.of(BookingStatus.ACTIVE, BookingStatus.CANCELLED));
        // ACTIVE -> COMPLETED (end booking)
        VALID_TRANSITIONS.put(BookingStatus.ACTIVE, EnumSet.of(BookingStatus.COMPLETED));
        // Terminal states: COMPLETED, CANCELLED
    }

    public CarSharingBooking createBooking(String carId, String userId) {
        CarSharingBooking booking = CarSharingBooking.builder()
                .carId(carId)
                .userId(userId)
                .status(BookingStatus.REQUESTED)
                .startTime(LocalDateTime.now())
                .build();
        return bookingRepository.save(booking);
    }

    @Transactional
    public CarSharingBooking updateStatus(Long bookingId, BookingStatus newStatus) {
        CarSharingBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking with id " + bookingId + " not found"));

        BookingStatus oldStatus = booking.getStatus();

        if (oldStatus == newStatus) {
            return booking;
        }

        if (!isValidTransition(oldStatus, newStatus)) {
            throw new InvalidStateTransitionException(
                    String.format("Invalid transition from %s to %s", oldStatus, newStatus));
        }

        if (newStatus == BookingStatus.COMPLETED) {
            booking.setEndTime(LocalDateTime.now());
        }

        booking.setStatus(newStatus);
        CarSharingBooking updatedBooking = bookingRepository.save(booking);

        AuditLogEntry auditLog = AuditLogEntry.builder()
                .entityId(bookingId)
                .oldStatus(oldStatus.name())
                .newStatus(newStatus.name())
                .timestamp(LocalDateTime.now())
                .build();

        // JULES-DEMO: Zustandsübergänge werden hier validiert und geloggt.
        auditLogRepository.save(auditLog);

        return updatedBooking;
    }

    private boolean isValidTransition(BookingStatus from, BookingStatus to) {
        Set<BookingStatus> allowed = VALID_TRANSITIONS.get(from);
        return allowed != null && allowed.contains(to);
    }

    public CarSharingBooking getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking with id " + bookingId + " not found"));
    }
}
