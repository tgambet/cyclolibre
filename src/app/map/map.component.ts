import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AgmInfoWindow, MapsAPILoader } from '@agm/core';
import { LatLngBounds, LatLngBoundsLiteral } from '@agm/core/services/google-maps-types';

import { } from 'googlemaps';

import { CitybikesService, Station, Network } from '../services/citybikes.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild("search")
  public searchElementRef: ElementRef;

  lat: number;
  lng: number;
  zoom: number;

  mapBounds: LatLngBounds | LatLngBoundsLiteral = {
    east: 90,
    west: -90,
    south: -45,
    north: 45
  }

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

  searchPosition: { latitude: number, longitude: number }

  lastUpdate: number

  constructor(
    private service: CitybikesService,
    private router: Router,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {

    this.route.parent.data.subscribe((data: { network: Network }) => {
      this.network = data.network
    });

    this.service
        .getStations(this.network)
        .then(stations => {
          this.loadMap(stations);
          this.stations = stations;
        })
        .catch(error => this.error = error.statusText);

    this.intervalID = window.setInterval(() => {
      this.service
          .getStations(this.network)
          .then(stations => {
            _.forEach(stations, (station: Station) => {
              let s: Station = _.find(this.stations, { 'id': station.id })
              if (s) {
                s.free_bikes = station.free_bikes;
                s.empty_slots = station.empty_slots;
                s.extra = station.extra;
                s.timestamp = station.timestamp;
                s.latitude = station.latitude;
                s.longitude = station.longitude;
              } else {
                this.stations.push(station);
              }
              this.lastUpdate = Date.now();
            });
          })
          .catch(error => console.log(error));

    }, this.autoUpdateInterval);

  }

  // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete?hl=fr
  // https://brianflove.com/2016/10/18/angular-2-google-maps-places-autocomplete/
  loadMap(stations: Station[]) {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      this.mapBounds = this.getBounds(stations);
      autocomplete.setBounds(this.mapBounds);
      autocomplete.addListener("place_changed", () => {
        //this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }
          if (place.geometry.viewport) {
            this.mapBounds = place.geometry.viewport as any
          } else {
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.zoom = 17;
          }
          this.searchPosition = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          }
        //});
      });
    });
  }

  ngOnDestroy() {
    if (this.intervalID)
      clearInterval(this.intervalID);
    if (this.geoWatchId)
      navigator.geolocation.clearWatch(this.geoWatchId);
  }

  getBounds(stations: Station[]) {
    let lats = _.map(stations, (station: Station) => station.latitude);
    let lngs = _.map(stations, (station: Station) => station.longitude);
    return {
      north: _.max(lats),
      south: _.min(lats),
      west: _.min(lngs),
      east: _.max(lngs)
    }
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

  isClosed(station: Station) {
    return station.extra && station.extra['status'] && station.extra['status'].toLowerCase() == "closed"
      || station.free_bikes == 0 && station.empty_slots == 0
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
      console.log("TODO - not available")
      /* geolocation IS NOT available */
    }
  }

  onCenterChange(center) {
    this.lat = center.lat;
    this.lng = center.lng;
  }

  onZoomChange(zoom) {
    this.zoom = zoom;
  }

  onMapReady(map: any) {
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
  }

  getLastUpdated() {
    let timestamps = _.map(this.stations, (station) => station.timestamp)
    return _.max(timestamps);
  }

}
