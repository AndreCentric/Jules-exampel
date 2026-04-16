package com.example.demo;

import com.example.demo.domain.BookingStatus;
import com.example.demo.domain.Car;
import com.example.demo.domain.CarSharingBooking;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    @Override
    public void run(String... args) throws Exception {
        if (carRepository.count() == 0) {
            Car car1 = Car.builder().licensePlate("VW-ID3-001").brand("VW").model("ID.3").build();
            Car car2 = Car.builder().licensePlate("TESLA-M3-002").brand("Tesla").model("Model 3").build();
            Car car3 = Car.builder().licensePlate("BMW-I3-003").brand("BMW").model("i3").build();
            carRepository.saveAll(Arrays.asList(car1, car2, car3));
            System.out.println("Sample fleet initialized.");
        }

        if (bookingRepository.count() == 0) {
            CarSharingBooking booking1 = CarSharingBooking.builder()
                    .carId("VW-ID3-001")
                    .userId("user_123")
                    .status(BookingStatus.REQUESTED)
                    .startTime(LocalDateTime.now().minusHours(2))
                    .build();

            CarSharingBooking booking2 = CarSharingBooking.builder()
                    .carId("TESLA-M3-002")
                    .userId("user_456")
                    .status(BookingStatus.ACTIVE)
                    .startTime(LocalDateTime.now().minusDays(1))
                    .build();

            CarSharingBooking booking3 = CarSharingBooking.builder()
                    .carId("BMW-I3-003")
                    .userId("user_789")
                    .status(BookingStatus.COMPLETED)
                    .startTime(LocalDateTime.now().minusDays(2))
                    .endTime(LocalDateTime.now().minusDays(2).plusHours(4))
                    .build();

            bookingRepository.saveAll(Arrays.asList(booking1, booking2, booking3));
            System.out.println("Sample car sharing bookings initialized.");
        }
    }
}
