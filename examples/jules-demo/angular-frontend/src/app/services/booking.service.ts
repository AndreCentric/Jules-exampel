import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingStatus, CreateBookingRequest, StatusUpdateRequest, AuditLogEntry } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getBookings(status?: BookingStatus): Observable<Booking[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`, { params });
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  createBooking(request: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, request);
  }

  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    const request: StatusUpdateRequest = { status };
    return this.http.patch<Booking>(`${this.apiUrl}/bookings/${id}/status`, request);
  }

  getAuditLogs(bookingId?: number): Observable<AuditLogEntry[]> {
    let params = new HttpParams();
    if (bookingId) {
      params = params.set('bookingId', bookingId.toString());
    }
    return this.http.get<AuditLogEntry[]>(`${this.apiUrl}/audit-logs`, { params });
  }
}
