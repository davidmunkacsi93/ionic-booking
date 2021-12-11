import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PlacesService } from 'src/app/places.service';
import { Place } from '../places.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  private filter = 'all';

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.applyFilter(this.filter);
    });
  }

  onFilterUpdate(event: Event) {
    const segmentChangeEventDetail =
      event as CustomEvent<SegmentChangeEventDetail>;
    if (segmentChangeEventDetail === null) {
      return;
    }

    this.applyFilter(segmentChangeEventDetail.detail.value);
  }

  applyFilter(filter: string) {
    this.filter = filter;

    if (filter === 'all') {
      this.relevantPlaces = this.loadedPlaces;
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
    }

    this.listedLoadedPlaces = this.relevantPlaces.slice(1);
  }
}
