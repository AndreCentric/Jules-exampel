package com.example.demo.controller;

import com.example.demo.domain.ChargingSession;
import com.example.demo.domain.ChargingStatus;
import com.example.demo.dto.StatusUpdateRequest;
import com.example.demo.exception.InvalidStateTransitionException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.ChargingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChargingController.class)
class ChargingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChargingService chargingService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetSessionNotFound() throws Exception {
        when(chargingService.getSession(999L)).thenThrow(new ResourceNotFoundException("Not found"));

        mockMvc.perform(get("/api/charging/sessions/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Not found"));
    }

    @Test
    void testInvalidTransitionApi() throws Exception {
        StatusUpdateRequest request = new StatusUpdateRequest();
        request.setStatus(ChargingStatus.FINISHED);

        when(chargingService.updateStatus(eq(1L), any())).thenThrow(new InvalidStateTransitionException("Invalid transition"));

        mockMvc.perform(patch("/api/charging/sessions/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid transition"));
    }

    @Test
    void testSuccessfulStatusUpdate() throws Exception {
        StatusUpdateRequest request = new StatusUpdateRequest();
        request.setStatus(ChargingStatus.CHARGING);

        ChargingSession session = ChargingSession.builder()
                .id(1L)
                .status(ChargingStatus.CHARGING)
                .build();

        when(chargingService.updateStatus(eq(1L), any())).thenReturn(session);

        mockMvc.perform(patch("/api/charging/sessions/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CHARGING"));
    }
}
