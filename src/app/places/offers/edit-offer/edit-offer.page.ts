import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from 'src/app/places.service';
import { DateService } from 'src/app/services/date.service';
import { Place } from '../../places.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  form: FormGroup;
  place: Place;

  availableFromMinDate: string;
  availableToMinDate: string;
  maxDate: string;

  constructor(
    private dateService: DateService,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });

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
      title: new FormControl(this.place.title, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(this.place.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      price: new FormControl(this.place.price, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(100)],
      }),
      dateFrom: new FormControl(this.place.dateFrom.toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(this.place.dateTo.toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  onEditOffer() {}

  onBackButtonClicked() {
    this.navCtrl.navigateBack('/places/tabs/offers/' + this.place.id);
  }
}
