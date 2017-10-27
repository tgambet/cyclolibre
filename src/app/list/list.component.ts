import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CitybikesService, Station, Network } from '../services/citybikes.service';
import { FavoriteService } from '../services/favorite.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-list.container',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(
    private service: CitybikesService,
    private favorites: FavoriteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  network: Network

  stations: Station[]

  error: string

  stationFilter: string = "";

  autoUpdateInterval: number = 60000;

  intervalID: number;

  showNumber: number = 10;

  showFavoritesOnly: boolean = false;

  ngOnInit() {
    this.route.parent.data.subscribe((data: { network: Network }) => {
      this.network = data.network
    });

    this.service
        .getStations(this.network)
        .then(stations => {
          this.stations = stations;
        })
        .catch(error => this.error = error.statusText);

    this.intervalID = window.setInterval(() => {
      this.service
          .getStations(this.network)
          .then(stations => {
            this.stations = stations;
          })
          .catch(error => console.log(error));
    }, this.autoUpdateInterval);
  }

  ngOnDestroy() {
    if (this.intervalID)
      clearInterval(this.intervalID);
  }

  filteredStations(number: number): Station[] {
    function filterBase(station: Station) {
      return (station.name).toLowerCase();
    }
    let filtered = _.filter(
      this.stations,
      (station: Station) => filterBase(station).includes(this.stationFilter.toLowerCase())
    )

    this.showFavoritesOnly ? filtered = _.filter(filtered, (station) => this.favorites.isFavorite(station)) : filtered;

    let sorted = _.sortBy(filtered, (station) => station.name)
    return sorted.slice(0, number);
  }

  isClosed(station: Station) {
    return station.extra && station.extra['status'] && station.extra['status'].toLowerCase() == "closed"
      || station.free_bikes == 0 && station.empty_slots == 0
  }

  showMore() {
    this.showNumber += 10;
  }

  toggleFavorite(station: Station) {
    this.favorites.toggleFavorite(station);
  }

  isFavorite(station: Station): boolean {
    return this.favorites.isFavorite(station)
  }

}
