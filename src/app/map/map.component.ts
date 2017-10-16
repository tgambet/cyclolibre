import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JcDecauxService, Station } from '../services/jc-decaux.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat: number = 48.8566458;
  lng: number = 2.3479486;
  zoom: number = 12;

  typeLooked: string = "bike";

  stations: Station[] = [];

  error: string;

  constructor(
    private jcDecauxService: JcDecauxService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
        .subscribe((params: Params) => {
          let id = params['id']
          this.jcDecauxService
              .getStations(id)
              .then(stations => this.stations = stations)
              .catch(error => this.error = error.statusText);
        });
  }

  getAvailableBikes() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.available_bikes, 0);
  }

  getAvailableBikeStands() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.available_bike_stands, 0);
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
