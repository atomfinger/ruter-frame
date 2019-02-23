import { Component, OnInit } from '@angular/core';

import { IDeparture } from './departure';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  departures: IDeparture[] = [];

  constructor() {
    this.departures = [{
      routeId: '31E',
      departureTime: '18:30'
    },
    {
      routeId: '36E',
      departureTime: '18:31'
    },
    {
      routeId: '17',
      departureTime: '18:36'
    }];
  }

  ngOnInit() {
  }

}
