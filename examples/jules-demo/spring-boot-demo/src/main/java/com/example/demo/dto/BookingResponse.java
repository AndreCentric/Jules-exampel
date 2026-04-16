package com.example.demo.dto;

import com.example.demo.domain.BookingStatus;
import com.example.demo.domain.CarSharingBooking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private BookingStatus status;
    private String carId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<BookingStatus> allowedTransitions;

    public static BookingResponse fromDomain(CarSharingBooking booking, Set<BookingStatus> allowedTransitions) {
        return BookingResponse.builder()
                .id(booking.getId())
                .status(booking.getStatus())
                .carId(booking.getCarId())
                .userId(booking.getUserId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .allowedTransitions(allowedTransitions)
                .build();
    }
}
