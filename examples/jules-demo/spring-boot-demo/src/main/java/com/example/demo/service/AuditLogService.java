package com.example.demo.service;

import com.example.demo.domain.AuditLogEntry;
import com.example.demo.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLogEntry> getAuditLogs(String carId, LocalDateTime from, LocalDateTime to) {
        return auditLogRepository.findByFilters(carId, from, to);
    }
}
