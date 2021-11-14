import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getAvailableFromMinDateISOString() {
    return new Date().toISOString();
  }

  getAvailableToMinDateISOString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return new Date(year, month, day + 2).toISOString();
  }

  getMaxDateISOString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    return new Date(year + 4, month, day + 1).toISOString();
  }
}
