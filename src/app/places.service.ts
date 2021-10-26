import { Injectable } from '@angular/core';
import { Place } from './places/places.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of NYC.',
      'https://thumbs.nestseekers.com/JUlRoXyPxJK9R5XG.jpg',
      149.99
    ),
    new Place(
      'p1',
      'L\'Amour Toujours',
      'A romantic place in paris.',
      'https://images.squarespace-cdn.com/content/v1/5bc5dd89f8135a188f4d62a5/1583501077136-YWI0NDO0D0PXBI229SV4/ke17ZwdGBToddI8pDm48kIKSX_SZjyDOj8RLeXGW1RN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmQyViSO8WVy1F2YAzXWvEVNabebp8wOGGQ-vpKUbL-vgz2y3-FwKjJA13dgL8WU6V/The+Beautiful+Paris+Apartment+of+Jackie+Kai+Ellis+-+The+Nordroom',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip.',
      'https://images.unsplash.com/photo-1606454277702-91f9c92257cc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9nZ3klMjBjaXR5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80',
      99.99
    ),
  ];

  constructor() {}

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return { ...this._places.find((p) => p.id === id) };
  }
}
