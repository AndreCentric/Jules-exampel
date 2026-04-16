package com.example.demo.repository;

import com.example.demo.domain.AuditLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntry, Long> {
    List<AuditLogEntry> findByEntityId(Long entityId);
}
