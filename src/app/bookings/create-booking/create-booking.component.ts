import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/places.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', { static: true }) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.dateFrom);
    const availableTo = new Date(this.selectedPlace.dateTo);

    const dayInMiliseconds = 24 * 60 * 60 * 1000;
    const sixDaysInMiliseconds = 6 * dayInMiliseconds;
    const weekInMiliseconds = 7 * dayInMiliseconds;

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              weekInMiliseconds -
              availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              sixDaysInMiliseconds -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onBookPlace(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.modalCtrl.dismiss(
      { message: 'This is a dummy message.' },
      'confirm',
      this.selectedPlace.id
    );
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel', this.selectedPlace.id);
  }

  areDatesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);

    return endDate > startDate;
  }
}
