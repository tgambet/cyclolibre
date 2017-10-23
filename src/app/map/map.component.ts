import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AgmInfoWindow } from '@agm/core';

import { } from 'googlemaps';

import { CitybikesService, Station, Network } from '../services/citybikes.service';

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

  mapStyles = [
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

  typeLooked: string = "bike"; // or "stand"

  stations: Station[];

  network: Network;

  error: string;

  autoUpdateInterval: number = 60000;

  intervalID: number;

  showInfo: boolean = false;

  geoWatchId: number;

  userPosition: { latitude: number, longitude: number }

  constructor(
    private service: CitybikesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.parent.data.subscribe((data: { network: Network }) => {
      this.network = data.network
    });

    this.service
        .getStations(this.network)
        .then(stations => {
          this.centerMap(stations)
          this.stations = stations
        })
        .catch(error => this.error = error.statusText);

    this.intervalID = window.setInterval(() => {
      this.service
          .getStations(this.network)
          .then(stations => {
            _.forEach(stations, (station) => {
              let s = _.find(this.stations, { 'id': station.id })
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

  }

  ngOnDestroy() {
    if (this.intervalID)
      clearInterval(this.intervalID);
    if (this.geoWatchId)
      navigator.geolocation.clearWatch(this.geoWatchId);
  }

  centerMap(stations: Station[]) {
      // define lat and lng
      let lats = _.map(stations, (station: Station) => station.latitude);
      let lngs = _.map(stations, (station: Station) => station.longitude);
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
    if (s.empty_slots == 0 && s.free_bikes == 0 || s.extra && s.extra['status'] && s.extra['status'].toLowerCase() == "closed")
      return 'assets/icon.svg';
    let stands = s.free_bikes + s.empty_slots;
    let percentage =
      this.typeLooked == "bike" ? s.free_bikes / stands : s.empty_slots / stands;
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
    return _.reduce(this.stations, (a: number, b: Station) => a + b.free_bikes, 0);
  }

  getTotalStands() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.free_bikes + b.empty_slots, 0);
  }

  getAvailableBikeStands() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.empty_slots, 0);
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

  onMapReady(map: any) {
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
  }

}
