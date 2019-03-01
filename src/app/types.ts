export interface Wrapper {
    data: Data;
}

export interface Data {
    quay: Quay;
}

export interface Quay {
    id: string;
    estimatedCalls: EstimatedCall[];
}

export interface EstimatedCall {
    expectedArrivalTime: string;
    actualArrivalTime: string;
    cancellation: boolean;
    destinationDisplay: DestinationDisplay;
    serviceJourney: ServiceJourney;
}

export interface DestinationDisplay {
    frontText: string;
}

export interface ServiceJourney {
    journeyPattern: JourneyPattern;
}

export interface JourneyPattern {
    line: Line;
}

export interface Line {
    id: string;
    name: string;
    publicCode: string;
}

export interface IDeparture {
    routeId: string;
    departureTime: string;
}

export class Departure implements IDeparture {
    routeId: string;
    departureTime: string;
    departureMin: number;
}
