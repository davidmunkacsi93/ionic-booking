import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  availableFromMinDate: string;
  availableToMinDate: string;
  maxDate: string;

  constructor() {}

  ngOnInit() {
    this.availableFromMinDate = new Date().toISOString();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    this.availableToMinDate = new Date(year, month, day + 2).toISOString();
    this.maxDate = new Date(year + 4, month, day + 1).toISOString();
  }

  onCreateOffer() {
    console.log('Creating offered place...');
  }
}
