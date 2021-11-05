import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private $bookings: Booking[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      placeTitle: 'Manhattan Mansion',
      guestNumber: 2,
      userId: 'abc'
    }
  ];

  get bookings() {
    return [...this.$bookings];
  }
}
