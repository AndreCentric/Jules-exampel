package com.example.demo.controller;

import com.example.demo.domain.AuditLogEntry;
import com.example.demo.service.AuditLogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuditLogController.class)
class AuditLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuditLogService auditLogService;

    @Test
    void testGetAuditLogs() throws Exception {
        AuditLogEntry entry = AuditLogEntry.builder()
                .id(1L)
                .entityId(100L)
                .carId("CAR-1")
                .userId("USER-1")
                .newStatus("REQUESTED")
                .timestamp(LocalDateTime.now())
                .build();

        when(auditLogService.getAuditLogs(any(), any(), any())).thenReturn(Arrays.asList(entry));

        mockMvc.perform(get("/api/audit-logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].carId").value("CAR-1"))
                .andExpect(jsonPath("$[0].newStatus").value("REQUESTED"));
    }

    @Test
    void testGetAuditLogsWithFilters() throws Exception {
        AuditLogEntry entry = AuditLogEntry.builder()
                .id(1L)
                .carId("VW-ID3")
                .timestamp(LocalDateTime.of(2023, 10, 27, 10, 0))
                .build();

        when(auditLogService.getAuditLogs(eq("VW-ID3"), any(), any())).thenReturn(Arrays.asList(entry));

        mockMvc.perform(get("/api/audit-logs")
                .param("carId", "VW-ID3")
                .param("from", "2023-10-27T00:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].carId").value("VW-ID3"));
    }
}
