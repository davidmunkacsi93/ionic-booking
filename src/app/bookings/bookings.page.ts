import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading = false;
  private bookingSub: Subscription;

  constructor(
    private bookingsService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnDestroy(): void {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    this.loadingCtrl.create({message: 'Cancelling...'}).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
        slidingBooking.close();
      });
    });
  }
}
