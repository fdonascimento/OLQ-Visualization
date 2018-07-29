import { Component, OnInit } from '@angular/core';
import { circle, latLng, Map, polyline, tileLayer } from 'leaflet';
import { BestLocationService } from '../best-location-service';
import { Place } from './Place';

@Component({
  selector: 'app-map-visualization',
  templateUrl: './map-visualization.component.html',
  styleUrls: ['./map-visualization.component.css'],
  providers: [BestLocationService]
})
export class MapVisualizationComponent implements OnInit {

  private googleMaps;
  public options;
  private lastPlaceClicked: Place;
  private candidates: Array<Place>;
  private facilities: Array<Place>;
  private map: Map;

  constructor(private bestLocationService: BestLocationService) {
    // Define our base layers so we can reference them multiple times
    this.googleMaps = tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true
    });

    // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
    this.options = {
      layers: [ this.googleMaps],
      zoom: 12,
      center: latLng([ -12.919949, -38.419847 ])
    };

    this.candidates = new Array<Place>();
  }

  ngOnInit() {
  }

  onMapReady(map: Map) {
    this.map = map;
    const result = this.bestLocationService.findBestLocation();
    result.subscribe(data => {
      this.putClientsOnMap(map, data.clients);
      this.putFacilitiesOnMap(map, data.facilities);
      this.putCandidatesOnMap(data.candidates);
      this.putBestLocationOnMap(data.firstBestLocation);
    });
  }

  private putCandidatesOnMap(candidates) {
    for (const candidate of candidates) {
      this.putCandidateOnMap(candidate, 'blue');
    }
  }

  private putBestLocationOnMap(bestLocation) {
    this.putCandidateOnMap(bestLocation, 'purple');
  }

  private putCandidateOnMap(candidate, color: string): void {
    const place = new Place(candidate.latitude, candidate.longitude);
    place.setColorMarker(color);
    place.setAttractedClients(candidate.attractedClients);
    place.setMaxDistance(candidate.farthestClient);
    place.setMinDistance(candidate.closestClient);
    this.candidates.push(place);
    this.drawPlace(this.map, place);
  }

  private drawPlace(map: Map, place: Place) {
    const markerPlace = place.getMarker();
    markerPlace.addTo(map);
    markerPlace.on('click', () => this.seeAttractedArea(place));
  }

  private seeAttractedArea(place: Place) {
    if (this.lastPlaceClicked != null) {
      this.map.removeLayer(this.lastPlaceClicked.getAttractedArea());
      this.map.removeLayer(place.getMarker());
      this.map.removeLayer(place.getMaxDistance());
      this.map.removeLayer(place.getMinDistance());
      this.lastPlaceClicked = null;
      this.showCandidates();
    } else {
      this.hideCandidates();
      place.getAttractedArea().addTo(this.map);
      place.getAttractedArea().bringToBack();
      place.getMarker().addTo(this.map);
      place.getMaxDistance().addTo(this.map);
      place.getMinDistance().addTo(this.map);
      this.lastPlaceClicked = place;
    }
  }

  private seeInfo(place: Place, markerPlace: any) {

  }

  private hideCandidates() {
    for (const candidate of this.candidates) {
      this.map.removeLayer(candidate.getMarker());
    }
  }

  private showCandidates() {
    for (const candidate of this.candidates) {
      candidate.getMarker().addTo(this.map);
    }
  }

  private putClientsOnMap(map: Map, clients) {

    for (const client of clients) {
      const clientMarker = circle([client.latitude, client.longitude], {
        color: 'green',
        fillOpacity: 0.5,
        opacity: 0.5,
        radius: 80,
        weight: 0
      });

      clientMarker.addTo(map);
    }
  }

  private putFacilitiesOnMap(map: Map, facilitiesJson) {
    this.facilities = new Array<Place>();
    for (const facility of facilitiesJson) {
      const place = new Place(facility.latitude, facility.longitude);
      place.setColorMarker('red');
      place.setAttractedClients(facility.attractedClients);
      place.setMaxDistance(facility.farthestClient);
      place.setMinDistance(facility.closestClient);

      place.getAttractedArea().addTo(map);
      place.getMarker().addTo(map);

      place.getMarker().on('click', () => this.showFacilityLines(place));

      this.facilities.push(place);
    }
  }

  private showFacilityLines(facility: Place) {
    if (facility.isClicked()) {
      this.map.removeLayer(facility.getMaxDistance());
      this.map.removeLayer(facility.getMinDistance());
    } else {
      facility.getMaxDistance().addTo(this.map);
      facility.getMinDistance().addTo(this.map);
    }
    facility.click();
  }

  public hideFacilitiesAttractedArea() {
    for (const facility of this.facilities) {
      facility.setClicked(false);
      this.map.removeLayer(facility.getMaxDistance());
      this.map.removeLayer(facility.getMinDistance());
      this.map.removeLayer(facility.getAttractedArea());
    }
  }

  public showFacilitiesAttractedArea() {
    for (const facility of this.facilities) {
      facility.getAttractedArea().addTo(this.map);
      facility.getAttractedArea().bringToBack();
      facility.getMarker();
    }
  }
}
