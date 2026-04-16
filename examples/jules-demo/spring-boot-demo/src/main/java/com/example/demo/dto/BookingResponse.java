package com.example.demo.dto;

import com.example.demo.domain.BookingStatus;
import com.example.demo.domain.CarSharingBooking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.demo.domain.Car;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private BookingStatus status;
    private String carId;
    private String carBrand;
    private String carModel;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<BookingStatus> allowedTransitions;

    public static BookingResponse fromDomain(CarSharingBooking booking, Set<BookingStatus> allowedTransitions, Car car) {
        return BookingResponse.builder()
                .id(booking.getId())
                .status(booking.getStatus())
                .carId(booking.getCarId())
                .carBrand(car != null ? car.getBrand() : null)
                .carModel(car != null ? car.getModel() : null)
                .userId(booking.getUserId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .allowedTransitions(allowedTransitions)
                .build();
    }
}
