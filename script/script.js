
//HTTPHEADER: https://www.entur.org/dev/api/header/

//https://api.entur.org/journeyplanner/2.0/index/graphql
/*
{
  stopPlace(id: "NSR:StopPlace:58255") {

    estimatedCalls(startTime: "2018-11-06T19:38:00+0200", timeRange: 72100, numberOfDepartures: 10) {
      realtime
      aimedArrivalTime
      aimedDepartureTime
      expectedArrivalTime
      expectedDepartureTime
      forBoarding
      forAlighting
      destinationDisplay {
        frontText
      }
      quay {
        id
      }
      serviceJourney {
        journeyPattern {
          line {
            id
            name
            transportMode
          }
        }
      }
    }
  }
}
*/

//https://api.entur.org/stop_places/1.0/graphql
/*
stopPlace(size: 5,
    stopPlaceType: onstreetBus, query: "rosenhoff"
  ) {
  id
  keyValues {
    key
    values
  }
  name {
    value
  }
  ... on StopPlace {
    quays {
      id
      keyValues {
        key
        values
      }
      geometry {
        type
        coordinates
      }
    }
  }
}
}*/
