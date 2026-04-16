package com.example.demo.controller;

import com.example.demo.domain.BookingStatus;
import com.example.demo.domain.Car;
import com.example.demo.domain.CarSharingBooking;
import com.example.demo.dto.BookingResponse;
import com.example.demo.dto.CreateBookingRequest;
import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.service.BookingService;
import com.example.demo.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final CarService carService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(@RequestParam(required = false) BookingStatus status) {
        List<CarSharingBooking> bookings = bookingService.getBookings(status);
        List<BookingResponse> responses = bookings.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody CreateBookingRequest request) {
        CarSharingBooking booking = bookingService.createBooking(request.getCarId(), request.getUserId());
        return ResponseEntity.ok(mapToResponse(booking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {
        CarSharingBooking booking = bookingService.getBooking(id);
        return ResponseEntity.ok(mapToResponse(booking));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        CarSharingBooking booking = bookingService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(mapToResponse(booking));
    }

    private BookingResponse mapToResponse(CarSharingBooking booking) {
        Car car = carService.getCarByLicensePlate(booking.getCarId());
        return BookingResponse.fromDomain(
                booking,
                bookingService.getAllowedTransitions(booking.getStatus()),
                car
        );
    }
}
