import { Component, OnInit } from '@angular/core';

import { Wrapper, Departure, IDeparture, EstimatedCall, Quay } from '../types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['icon', 'routeId', 'departureTime'];
  departures: IDeparture[] = [];
  interval: NodeJS.Timer;

  ngOnInit() {
    this.refreshData();
    this.interval = setInterval(() => { this.refreshData(); }, 30000);
  }

  refreshData() {
    console.log('Refreshing data');
    const data = '{"query":"{\\n  quays(ids: [\\"NSR:Quay:104044\\", \\"NSR:Quay:11054\\"]) {\\n    id\\n    estimatedCalls(numberOfDepartures: 25, omitNonBoarding: true) {\\n      expectedArrivalTime\\n      actualArrivalTime\\n      cancellation\\n\\n      destinationDisplay {\\n        frontText\\n      }\\n      serviceJourney {\\n        journeyPattern {\\n          line {\\n            id\\n            name\\n            publicCode\\n            transportMode\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n"}';
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.withCredentials = false;
    xhr.open('POST', 'https://api.entur.org/journeyplanner/2.0/index/graphql');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.parseJson(xhr.responseText);
      }
    };
    xhr.send(data);
  }

  parseJson(json: string) {
    const list: Departure[] = [];
    const result: Wrapper = JSON.parse(json);
    console.log(result);
    result.data.quays.forEach((quay: Quay) => {
      quay.estimatedCalls.forEach((estimatedCall: EstimatedCall) => {
        list.push(this.getDeparture(estimatedCall));
      });
    });
    this.departures = list.sort((a, b) => a.departureMin - b.departureMin).slice(0, 20);
  }

  getDeparture(estimatedCall: EstimatedCall): Departure {
    const departure = new Departure();
    departure.routeId = estimatedCall.destinationDisplay.frontText + ' ('
      + estimatedCall.serviceJourney.journeyPattern.line.publicCode + ')';
    const date: Date = new Date(estimatedCall.expectedArrivalTime);
    const diffInMins = this.dateDiffInMin(date);
    departure.departureTime = this.getTimeText(diffInMins);
    departure.departureMin = diffInMins;
    if (estimatedCall.serviceJourney.journeyPattern.line.transportMode.toLowerCase() === 'tram') {
      departure.iconPath = '/assets/img/tram.png';
      departure.color = '#b3d9ff';
    } else {
      departure.iconPath = '/assets/img/bus.png';
      departure.color = '#ffc2b3';
    }
    return departure;
  }

  dateDiffInMin(todate: Date): number { return Math.floor((+todate - +new Date()) / 60000); }

  getTimeText(diffInMins: number): string {
    if (diffInMins === 0) {
      return 'Nå';
    } else if (diffInMins > 59) {
      const hours = Math.floor(diffInMins / 60);
      const minutes = diffInMins - (hours * 60);
      return hours + ' timer ' + ((minutes <= 0) ? '' : minutes + ' min');
    } else {
      return diffInMins + ' min';
    }
  }
}
