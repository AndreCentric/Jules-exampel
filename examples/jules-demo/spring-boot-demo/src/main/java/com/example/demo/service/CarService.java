package com.example.demo.service;

import com.example.demo.domain.Car;
import com.example.demo.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Transactional
    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public Car getCarByLicensePlate(String licensePlate) {
        return carRepository.findByLicensePlate(licensePlate).orElse(null);
    }
}
