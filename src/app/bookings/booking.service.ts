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
    let generatedId: string;
    let newBooking: Booking;
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }

        fetchedUserId = userId;

        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );

        return this.http.post<{ name: string }>(`${this.dbUrl}/bookings.json?auth=${token}`, {
          ...newBooking,
          id: null,
        });
      }),
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
    return this.authService.token.pipe(
      take(1),
      switchMap(token => this.http.delete(`${this.dbUrl}/bookings/${bookingId}.json?auth=${token}`)),
      switchMap(() => this.bookings),
      take(1),
      tap((bookings) => {
        this.$bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user found.');
        }

        fetchedUserId = userId;

        return this.authService.token;
      }),
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: BookingData }>(
          `${this.dbUrl}/bookings.json?auth=${token}&orderBy="userId"&equalTo="${fetchedUserId}"`
        )),
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
      tap((bookings) => {
        this.$bookings.next(bookings);
      })
    );
  }
}
