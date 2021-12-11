/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { Place } from './places/places.model';

interface PlaceData {
  dateFrom: string;
  dateTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private dbUrl =
    'https://ionic-booking-d33eb-default-rtdb.europe-west1.firebasedatabase.app/';
  private offeredPlacesUrl = this.dbUrl + 'offered-places.json';
  private $places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this.$places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => ({ ...places.find((p) => p.id === id) }))
    );
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(this.offeredPlacesUrl)
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const placeByKey = resData[key];
              places.push(
                new Place(
                  key,
                  placeByKey.title,
                  placeByKey.description,
                  placeByKey.imageUrl,
                  placeByKey.price,
                  new Date(placeByKey.dateFrom),
                  new Date(placeByKey.dateTo),
                  placeByKey.userId
                )
              );
            }
          }

          return places;
        }),
        tap(places => {
          this.$places.next(places);
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const fixImageUrl = 'https://thumbs.nestseekers.com/JUlRoXyPxJK9R5XG.jpg';
    const randomUserId = Math.random().toString();

    const newPlace = new Place(
      randomUserId,
      title,
      description,
      fixImageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    let generatedId;
    return this.http
      .post<{ name: string }>(this.offeredPlacesUrl, {
        ...newPlace,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this.$places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(
    placeId: string,
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex(
          (place) => place.id === placeId
        );

        if (!updatedPlaceIndex) {
          return;
        }

        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];

        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          price,
          dateFrom,
          dateTo,
          oldPlace.userId
        );

        this.$places.next(updatedPlaces);
      })
    );
  }
}
