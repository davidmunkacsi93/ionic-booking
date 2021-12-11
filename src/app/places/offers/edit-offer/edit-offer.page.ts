import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlacesService } from 'src/app/places.service';
import { DateService } from 'src/app/services/date.service';
import { Place } from '../../places.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  place: Place;

  availableFromMinDate: string;
  availableToMinDate: string;
  maxDate: string;

  private placeSub: Subscription;

  constructor(
    private dateService: DateService,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        return;
      }
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.place = place;

          this.initializeDates();
          this.initializeForm();
        });
    });
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
        validators: [Validators.required, Validators.min(0)],
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

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        this.form.value.dateFrom,
        this.form.value.dateTo
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

  onBackButtonClicked() {
    this.navCtrl.navigateBack('/places/tabs/offers/' + this.place.id);
  }
}
