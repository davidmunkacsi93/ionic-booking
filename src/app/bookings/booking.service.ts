import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private $bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this.$bookings.asObservable();
  }

  constructor(private authService: AuthService) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.$bookings.pipe(take(1), delay(1000), tap(bookings => {
      this.$bookings.next(bookings.concat(newBooking));
    }));
  }

  cancelBooking(bookingId: string) {
    return this.$bookings.pipe(take(1), delay(1000), tap(bookings => {
      this.$bookings.next(bookings.filter(booking => booking.id !== bookingId));
    }));
  }
}
