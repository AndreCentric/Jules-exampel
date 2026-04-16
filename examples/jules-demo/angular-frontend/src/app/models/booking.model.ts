export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  id: number;
  status: BookingStatus;
  carId: string;
  carBrand?: string;
  carModel?: string;
  userId: string;
  startTime: string;
  endTime?: string;
  allowedTransitions: BookingStatus[];
}

export interface AuditLogEntry {
  id: number;
  entityId: number;
  carId: string;
  userId: string;
  oldStatus: string | null;
  newStatus: string;
  timestamp: string;
}

export interface CreateBookingRequest {
  carId: string;
  userId: string;
}

export interface StatusUpdateRequest {
  status: BookingStatus;
}
