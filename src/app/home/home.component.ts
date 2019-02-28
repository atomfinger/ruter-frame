import { Component, OnInit } from '@angular/core';

import { IDeparture } from './departure';

interface Wrapper {
  data: Data;
}

interface Data {
  quay: Quay;
}

interface Quay {
  id: string;
  estimatedCalls: EstimatedCall[];
}

interface EstimatedCall {
  expectedArrivalTime: string;
  actualArrivalTime: string;
  cancellation: boolean;
  destinationDisplay: DestinationDisplay;
  serviceJourney: ServiceJourney;
}

interface DestinationDisplay {
  frontText: string;
}

interface ServiceJourney {
  journeyPattern: JourneyPattern;
}

interface JourneyPattern {
  line: Line;
}

interface Line {
  id: string;
  name: string;
  publicCode: string;
}

class Departure implements IDeparture {
  routeId: string;
  departureTime: string;
  departureMin: number;

}

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
    const data = "{\"query\":\"{\\n  quay(id: \\\"NSR:Quay:104044\\\") {\\n    id\\n    estimatedCalls(numberOfDepartures: 50, omitNonBoarding: true) {\\n      expectedArrivalTime\\n      actualArrivalTime\\n      cancellation\\n      destinationDisplay {\\n        frontText\\n      }\\n      serviceJourney {\\n        journeyPattern {\\n          line {\\n            id\\n            name\\n            publicCode\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}";
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
    result.data.quay.estimatedCalls.forEach((estimatedCall: EstimatedCall) => {
      const departure = new Departure();
      departure.routeId = estimatedCall.destinationDisplay.frontText + ' ('
        + estimatedCall.serviceJourney.journeyPattern.line.publicCode + ')';
      const date: Date = new Date(estimatedCall.expectedArrivalTime);
      const diffInMins = this.dateDiffInMin(date);
      departure.departureTime = this.getTimeText(diffInMins);
      departure.departureMin = diffInMins;
      list.push(departure);
    });
    this.departures = list.sort((a, b) => a.departureMin - b.departureMin);
  }

  dateDiffInMin(todate): number {
    return Math.floor((todate - +new Date()) / 60000);
  }

  getTimeText(diffInMins: number): string {
    if (diffInMins === 0) {
      return 'Nå';
    } else {
      return diffInMins + ' mins';
    }
  }
}
