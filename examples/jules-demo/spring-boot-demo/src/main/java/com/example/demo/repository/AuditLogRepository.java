package com.example.demo.repository;

import com.example.demo.domain.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {
    List<AuditLogEntry> findByEntityId(Long entityId);

    @Query("SELECT a FROM AuditLogEntry a WHERE " +
           "(:carId IS NULL OR a.carId = :carId) AND " +
           "(:from IS NULL OR a.timestamp >= :from) AND " +
           "(:to IS NULL OR a.timestamp <= :to) " +
           "ORDER BY a.timestamp DESC")
    List<AuditLogEntry> findByFilters(
            @Param("carId") String carId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);
}
