package com.example.demo.repository;

import com.example.demo.domain.BookingStatus;
import com.example.demo.domain.CarSharingBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<CarSharingBooking, Long> {

    @Query("SELECT b FROM CarSharingBooking b WHERE " +
           "(:status IS NULL OR b.status = :status) " +
           "ORDER BY b.startTime DESC")
    List<CarSharingBooking> findByFilters(@Param("status") BookingStatus status);
}
