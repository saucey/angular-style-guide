import { Injectable } from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';

@Injectable({
  providers: [HTTP_PROVIDERS]
})
export class NibudService {
  mock: boolean = true;
  serviceUrl: string = 'https://service.nibud.nl/api/uitgaven/v1-0/aegon/referentiebedragen/';
  accessToken: string = '';

  constructor(
    private http:Http
  ) {}

  public referencePrices(data): Promise {

    if (this.mock === true) {
      //return new Promise().resolve(this.getMockData());
    }

    return this.handleRequest(data);
  }

  private handleRequest(data): Observable {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let result = new Observable();

    return this.http.post(this.serviceUrl, JSON.stringify(data), options)
      .map(res => res.json()
      .toPromise()
    );

    return result;
  }

  private getMockData(): Object [] {
    console.log('called NibudService.getMockData');
    return [
      {"id": 0, "basis": 59, "voorbeeld": 71},
      {"id": 1, "basis": 47, "voorbeeld": 52},
      {"id": 2, "basis": 16, "voorbeeld": 18},
      {"id": 10, "basis": 21, "voorbeeld": 21},
      {"id": 11, "basis": 22, "voorbeeld": 22},
      {"id": 12, "basis": 16, "voorbeeld": 16},
      {"id": 13, "basis": 14, "voorbeeld": 14},
      {"id": 15, "basis": 6, "voorbeeld": 6},
      {"id": 14, "basis": 6, "voorbeeld": 6},
      {"id": 20, "basis": 0, "voorbeeld": 0},
      {"id": 21, "basis": 15, "voorbeeld": 23},
      {"id": 22, "basis": 16, "voorbeeld": 25},
      {"id": 23, "basis": 25, "voorbeeld": 39},
      {"id": 33, "basis": 6, "voorbeeld": 6},
      {"id": 34, "basis": 11, "voorbeeld": 11},
      {"id": 35, "basis": 20, "voorbeeld": 23},
      {"id": 36, "basis": 13, "voorbeeld": 13},
      {"id": 37, "basis": 213, "voorbeeld": 213},
      {"id": 38, "basis": 62, "voorbeeld": 62},
      {"id": 40, "basis": 7, "voorbeeld": 7},
      {"id": 42, "basis": 0, "voorbeeld": 0},
      {"id": 50, "basis": 24, "voorbeeld": 32},
      {"id": 52, "basis": 5, "voorbeeld": 5},
      {"id": 51, "basis": 24, "voorbeeld": 64},
      {"id": 60, "basis": 20, "voorbeeld": 20},
      {"id": 61, "basis": 62, "voorbeeld": 62},
      {"id": 62, "basis": 62, "voorbeeld": 62},
      {"id": 63, "basis": 83, "voorbeeld": 83},
      {"id": 64, "basis": 41, "voorbeeld": 41},
      {"id": 65, "basis": 16, "voorbeeld": 16},
      {"id": 66, "basis": 22, "voorbeeld": 22},
      {"id": 70, "basis": 32, "voorbeeld": 32},
      {"id": 80, "basis": 136, "voorbeeld": 136},
      {"id": 90, "basis": 94, "voorbeeld": 108},
      {"id": 100, "basis": 89, "voorbeeld": 178},
      {"id": 110, "basis": 0, "voorbeeld": 0},
      {"id": 111, "basis": 64, "voorbeeld": 64},
      {"id": 113, "basis": 30, "voorbeeld": 30},
      {"id": 120, "basis": 74, "voorbeeld": 288},
      {"id": 130, "basis": 396, "voorbeeld": 396 },
      {"id": 132, "basis": 14, "voorbeeld": 14},
      {"id": 133, "basis": 62, "voorbeeld": 62},
      {"id": 134, "basis": 76, "voorbeeld": 76},
      {"id": 136, "basis": 0, "voorbeeld": 0},
      {"id": 135, "basis": 232, "voorbeeld": 684}
    ];
  }
}
