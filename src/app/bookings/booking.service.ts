import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookingData {
  placeId: string;
  userId: string;
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  lastName: string;
  guestNumber: number;
  placeTitle: string;
  placeImage: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private dbUrl =
    'https://ionic-booking-d33eb-default-rtdb.europe-west1.firebasedatabase.app';
  private $bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this.$bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

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

    let generatedId: string;
    return this.http
      .post<{ name: string }>(`${this.dbUrl}/bookings.json`, {
        ...newBooking,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this.$bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    return this.$bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this.$bookings.next(
          bookings.filter((booking) => booking.id !== bookingId)
        );
      })
    );
  }

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `${this.dbUrl}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((bookingData) => {
          const bookings = [];
          for (const key in bookingData) {
            if (bookingData.hasOwnProperty(key)) {
              const bookingByKey = bookingData[key];
              bookings.push(
                new Booking(
                  key,
                  bookingByKey.placeId,
                  bookingByKey.userId,
                  bookingByKey.placeTitle,
                  bookingByKey.placeImage,
                  bookingByKey.firstName,
                  bookingByKey.lastName,
                  bookingByKey.guestNumber,
                  new Date(bookingByKey.bookedFrom),
                  new Date(bookingByKey.bookedTo)
                )
              );
            }
          }

          return bookings;
        }),
        tap(bookings => {
          this.$bookings.next(bookings);
        })
      );
  }
}
