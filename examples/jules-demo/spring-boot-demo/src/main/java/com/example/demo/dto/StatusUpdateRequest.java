package com.example.demo.dto;

import com.example.demo.domain.BookingStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private BookingStatus status;
}
