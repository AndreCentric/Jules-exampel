package com.example.demo.controller;

import com.example.demo.domain.CarSharingBooking;
import com.example.demo.dto.CreateBookingRequest;
import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<CarSharingBooking> createBooking(@RequestBody CreateBookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request.getCarId(), request.getUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarSharingBooking> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CarSharingBooking> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request.getStatus()));
    }
}
