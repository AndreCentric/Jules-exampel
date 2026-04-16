package com.example.demo.dto;

import lombok.Data;

@Data
public class CreateBookingRequest {
    private String carId;
    private String userId;
}
