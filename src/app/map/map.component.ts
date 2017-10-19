import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AgmInfoWindow } from '@agm/core';

import { JcDecauxService, Station, Contract } from '../services/jc-decaux.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  lat: number = 46.7131494;
  lng: number = 1.6273467;
  zoom: number = 6;

  typeLooked: string = "bike"; // or "stand"

  stations: Station[];

  contract: Contract;

  error: string;

  autoUpdateInterval: number = 60000;

  intervalID: number;

  showInfo: boolean = false;

  constructor(
    private jcDecauxService: JcDecauxService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.params
        .subscribe((params: Params) => {

          let id = params['id'];

          this.jcDecauxService
              .getContract(id)
              .then((contract: Contract) => {
                this.contract = contract
              })
              .catch(error => this.error = error.statusText);

          this.jcDecauxService
              .getStations(id)
              .then(stations => {
                this.centerMap(stations)
                this.stations = stations
              })
              .catch(error => this.error = error.statusText);

          this.intervalID = window.setInterval(() => {
            this.jcDecauxService
                .getStations(id)
                .then(stations => {
                  _.forEach(stations, (station) => {
                    let s = _.find(this.stations, { 'number': station.number })
                    if (s) {
                      s.bike_stands = station.bike_stands;
                      s.available_bikes = station.available_bikes;
                      s.available_bike_stands = station.available_bike_stands;
                      s.position = station.position;
                      s.status = station.status;
                      s.lastUpdate = station.lastUpdate;
                    } else {
                      this.stations.push(station);
                    }
                  });
                })
                .catch(error => console.log(error));
          }, this.autoUpdateInterval);
        });
  }

  ngOnDestroy() {
    if (this.intervalID)
      clearInterval(this.intervalID);
    if (this.geoWatchId)
      navigator.geolocation.clearWatch(this.geoWatchId);
  }

  centerMap(stations: Station[]) {
      // define lat and lng
      let lats = _.map(stations, (station: Station) => station.position.lat);
      let lngs = _.map(stations, (station: Station) => station.position.lng);
      this.lat = _.max(lats) - (_.max(lats) - _.min(lats)) / 2;
      this.lng = _.max(lngs) - (_.max(lngs) - _.min(lngs)) / 2;
      // define the zoom
      let latSpread = _.max(lats) - _.min(lats)
      let lngSpread = _.max(lngs) - _.min(lngs)
      if (latSpread < 0.025 && lngSpread < 0.03)
        return this.zoom = 15;
      if (latSpread < 0.035 && lngSpread < 0.06)
        return this.zoom = 14;
      return this.zoom = 13;
  }

  clickedStation(stationNumber: string, index: number) {
    //console.log(`clicked the marker: ${stationNumber || index}`)
  }

  icon(s: Station) {
    if (s.status == "CLOSED")
      return 'assets/icon.svg';
    let percentage =
      this.typeLooked == "bike" ? s.available_bikes / s.bike_stands : s.available_bike_stands / s.bike_stands;
    if (percentage >= 0.75)
      return 'assets/icon-4.svg';
    if (percentage >= 0.50)
      return 'assets/icon-3.svg';
    if (percentage >= 0.25)
      return 'assets/icon-2.svg';
    if (percentage > 0)
      return 'assets/icon-1.svg';
    return 'assets/icon-0.svg';
  }

  getAvailableBikes() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.available_bikes, 0);
  }

  getTotalStands() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.bike_stands, 0);
  }

  getAvailableBikeStands() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.available_bike_stands, 0);
  }

  isNotGeolocalized() {
    return !this.geoWatchId;
  }

  isGeolocalized() {
    return this.geoWatchId && this.userPosition;
  }

  isGeolocalizing() {
    return this.geoWatchId && !this.userPosition;
  }

  geoWatchId: number;

  userPosition: { latitude: number, longitude: number }

  toggleGeoLocalization() {
    if ("geolocation" in navigator) {
      if (this.isGeolocalizing()) {
        return;
      } else if (this.isGeolocalized()) {
        navigator.geolocation.clearWatch(this.geoWatchId);
        this.geoWatchId = null;
        this.userPosition = null;
      } else {
        this.geoWatchId = navigator.geolocation.watchPosition(
          (position) => {
            // The first time center map on user position
            if (!this.userPosition) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
            }
            this.userPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
          (error) => { console.log(error) },
          {
            enableHighAccuracy: true,
            maximumAge        : 0,
            timeout           : 30000
          }
        );
      }
    } else {
      /* geolocation IS NOT available */
    }
  }

  onCenterChange(event) {
    this.lat = event.lat;
    this.lng = event.lng;
  }

}
