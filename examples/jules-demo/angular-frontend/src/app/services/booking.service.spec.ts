import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { BookingStatus, Booking } from '../models/booking.model';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingService]
    });
    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch bookings with status filter', () => {
    const mockBookings: Booking[] = [
      { id: 1, carId: 'CAR-1', userId: 'USER-1', status: BookingStatus.ACTIVE, startTime: '2023-01-01', allowedTransitions: [] }
    ];

    service.getBookings(BookingStatus.ACTIVE).subscribe(bookings => {
      expect(bookings.length).toBe(1);
      expect(bookings).toEqual(mockBookings);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/bookings?status=ACTIVE');
    expect(req.request.method).toBe('GET');
    req.flush(mockBookings);
  });

  it('should create a booking', () => {
    const mockBooking: Booking = { id: 2, carId: 'CAR-2', userId: 'USER-2', status: BookingStatus.REQUESTED, startTime: '2023-01-01', allowedTransitions: [] };
    const request = { carId: 'CAR-2', userId: 'USER-2' };

    service.createBooking(request).subscribe(booking => {
      expect(booking).toEqual(mockBooking);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/bookings');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockBooking);
  });
});
