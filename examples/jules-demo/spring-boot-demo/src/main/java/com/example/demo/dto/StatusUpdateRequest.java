package com.example.demo.dto;

import com.example.demo.domain.ChargingStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private ChargingStatus status;
}
