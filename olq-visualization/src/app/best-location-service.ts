import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Place } from './map-visualization/Place';

@Injectable()
export class BestLocationService {

    private olqApi: string;

    constructor(private http: Http) {
        this.olqApi = 'http://localhost:8080';
      }

    findBestLocation() {
      const url = `${this.olqApi}/findBestLocation`;
      console.log(url);
      return this.http.get(url).pipe(map( response => {
        console.log(response.statusText);
        return response.json();
      }));
    }

    getInfluenceArea(latitude: number, longitude: number) {
      const url = `${this.olqApi}/influenceArea/${latitude}/${longitude}`;
      console.log(url);
      return this.http.get(url).pipe(map( response => {
        console.log(response.statusText);
        return response.json();
      }));
    }

    inputCandidates(inputCandidates: Set<Place>) {
      const url = `${this.olqApi}/input-candidates`;
      console.log(url);
      const json = this.convertToJson(inputCandidates);

      const observable = this.http.post(url, json);

      observable.subscribe(response => {
          console.log(`Status: ${response.status}, StatusText: ${response.statusText}`);
        },
        message => console.error(`Error: ${message.statusText}`)
      );

      return observable;
    }

    private convertToJson(inputCandidates: Set<Place>): any {
      const json = {candidates: []};
      inputCandidates.forEach(candidate => {
        json.candidates.push({latitude: candidate.getLatitude(), longitude: candidate.getLongitude()});
      });
      console.log(json);
      return json;
    }
}
