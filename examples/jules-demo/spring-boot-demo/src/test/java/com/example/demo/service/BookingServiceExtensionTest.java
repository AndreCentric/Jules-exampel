package com.example.demo.service;

import com.example.demo.domain.BookingStatus;
import com.example.demo.domain.CarSharingBooking;
import com.example.demo.repository.BookingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class BookingServiceExtensionTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    void shouldFindBookingsByStatus() {
        bookingService.createBooking("CAR-1", "USER-1");
        CarSharingBooking active = bookingService.createBooking("CAR-2", "USER-2");
        bookingService.updateStatus(active.getId(), BookingStatus.ACTIVE);

        List<CarSharingBooking> requested = bookingService.getBookings(BookingStatus.REQUESTED);
        List<CarSharingBooking> activeList = bookingService.getBookings(BookingStatus.ACTIVE);

        assertThat(requested).extracting(CarSharingBooking::getCarId).contains("CAR-1");
        assertThat(activeList).extracting(CarSharingBooking::getCarId).contains("CAR-2");
    }

    @Test
    void shouldReturnAllowedTransitions() {
        Set<BookingStatus> requestedTransitions = bookingService.getAllowedTransitions(BookingStatus.REQUESTED);
        assertThat(requestedTransitions).containsExactlyInAnyOrder(BookingStatus.ACTIVE, BookingStatus.CANCELLED);

        Set<BookingStatus> activeTransitions = bookingService.getAllowedTransitions(BookingStatus.ACTIVE);
        assertThat(activeTransitions).containsExactlyInAnyOrder(BookingStatus.COMPLETED);

        Set<BookingStatus> completedTransitions = bookingService.getAllowedTransitions(BookingStatus.COMPLETED);
        assertThat(completedTransitions).isEmpty();
    }
}
