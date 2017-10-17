import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JcDecauxService, Station, Contract } from '../services/jc-decaux.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat: number = 46.7131494;
  lng: number = 1.6273467;
  zoom: number = 6;

  typeLooked: string = "bike"; // or "stand"

  stations: Station[];

  error: string;

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
              .getStations(id)
              .then(stations => {
                this.centerMap(stations)
                this.stations = stations
              })
              .catch(error => this.error = error.statusText);
        });
  }

  centerMap(stations: Station[]) {
      let lats = _.map(stations, (station: Station) => station.position.lat);
      let lngs = _.map(stations, (station: Station) => station.position.lng);
      this.lat = _.max(lats) - (_.max(lats) - _.min(lats)) / 2;
      this.lng = _.max(lngs) - (_.max(lngs) - _.min(lngs)) / 2;
      this.zoom = 13;
  }

  clickedStation(stationNumber: string, index: number) {
    console.log(`clicked the marker: ${stationNumber || index}`)
  }

  icon(s: Station) {
    if (s.status == "CLOSED")
      return 'assets/icon.svg';
    let percentage =
      this.typeLooked == "bike" ? s.available_bikes / s.bike_stands : s.available_bike_stands / s.bike_stands;
    if (percentage > 0.75)
      return 'assets/icon-4.svg';
    if (percentage > 0.50)
      return 'assets/icon-3.svg';
    if (percentage > 0.25)
      return 'assets/icon-2.svg';
    if (percentage > 0)
      return 'assets/icon-1.svg';
    return 'assets/icon-0.svg';
  }

}
