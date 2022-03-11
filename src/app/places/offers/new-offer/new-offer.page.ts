import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlacesService } from 'src/app/places.service';
import { DateService } from 'src/app/services/date.service';
import { PlaceLocation } from '../../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  availableFromMinDate: string;
  availableToMinDate: string;
  maxDate: string;

  constructor(
    private dateService: DateService,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.initializeDates();
    this.initializeForm();
  }

  initializeDates() {
    this.availableFromMinDate =
      this.dateService.getAvailableFromMinDateISOString();
    this.availableToMinDate = this.dateService.getAvailableToMinDateISOString();
    this.maxDate = this.dateService.getMaxDateISOString();
  }

  initializeForm() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(100)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Creating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.placesService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo),
            this.form.value.location
          )
          .subscribe(() => {
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
            loadingEl.dismiss();
          });
      });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }
}
