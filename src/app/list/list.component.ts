import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CitybikesService, Station, Network } from '../services/citybikes.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-list.container',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(
    private service: CitybikesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  network: Network

  stations: Station[]

  error: string

  stationFilter: string = "";

  autoUpdateInterval: number = 60000;

  intervalID: number;

  ngOnInit() {
    this.route.parent.data.subscribe((data: { network: Network }) => {
      this.network = data.network
    });

    this.service
        .getStations(this.network)
        .then(stations => {
          this.stations = stations;
          //this.updateDisplayedStations();
        })
        .catch(error => this.error = error.statusText);

    this.intervalID = window.setInterval(() => {
      this.service
          .getStations(this.network)
          .then(stations => {
            this.stations = stations;
            //this.updateDisplayedStations();
          })
          .catch(error => console.log(error));
    }, this.autoUpdateInterval);
  }

  ngOnDestroy() {
    if (this.intervalID)
      clearInterval(this.intervalID);
  }

  filteredStations(): Station[] {
    function filterBase(station: Station) {
      return (station.name).toLowerCase();
    }
    return _.filter(
      this.stations,
      (station: Station) => filterBase(station).includes(this.stationFilter.toLowerCase())
    )
  }

  isClosed(station: Station) {
    return station.extra && station.extra['status'] && station.extra['status'].toLowerCase() == "closed"
      || station.free_bikes == 0 && station.empty_slots == 0
  }


}
