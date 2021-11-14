import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateService } from 'src/app/services/date.service';

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

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.initializeDates();
    this.initializeForm();
  }

  initializeDates() {
    this.availableFromMinDate = this.dateService.getAvailableFromMinDateISOString();
    this.availableToMinDate = this.dateService.getAvailableToMinDateISOString();
    this.maxDate = this.dateService.getMaxDateISOString();
  }

  initializeForm() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(200)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(100)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    console.log(this.form);
  }
}
