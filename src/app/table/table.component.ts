import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CitybikesService, Station, Network } from '../services/citybikes.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  constructor(
    private service: CitybikesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplayedStations()
  }

  network: Network

  stations: Station[]

  displayedStations: Station[][]

  error: string

  sortedByProperty = "number"

  sortedByAscending = {
    'number': true,
    'address': true,
    'available_bikes': true,
    'available_bike_stands': true,
    'bike_stands': true
  }

  currentPage: number = 1

  perPage: number = 15;

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
          this.updateDisplayedStations();
        })
        .catch(error => this.error = error.statusText);

    this.intervalID = window.setInterval(() => {
      this.service
          .getStations(this.network)
          .then(stations => {
            this.stations = stations;
            this.updateDisplayedStations();
          })
          .catch(error => console.log(error));
    }, this.autoUpdateInterval);

  }

  ngOnDestroy() {
    if (this.intervalID)
      clearInterval(this.intervalID);
  }

  nextPage(): void {
    if (this.currentPage < this.numberOfPages()) this.currentPage += 1
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage -= 1
  }

  changePage(page: number): void {
    this.currentPage = page
  }

  numberOfPages(): number {
    return Math.ceil(this.filter(this.stations).length / this.perPage)
  }

  paginate(stations: Station[]): Station[][] {
    return _.chunk(stations, this.perPage);
  }

  sort(stations: Station[], property: string): Station[] {
    let sortedStations = _.sortBy(stations, property)
    return this.sortedByAscending[property] ? sortedStations : sortedStations.reverse()
  }

  filter(stations: Station[]): Station[] {
    function filterBase(station: Station) {
      return (station.name).toLowerCase();
    }
    return _.filter(
      this.stations,
      (station: Station) => filterBase(station).includes(this.stationFilter.toLowerCase())
    )
  }

  sortBy(property: string) {
    this.sortedByAscending[property] = !this.sortedByAscending[property]
    this.sortedByProperty = property
    this.changePage(1)
    this.updateDisplayedStations()
  }

  updateDisplayedStations() {
    this.displayedStations = this.paginate(this.sort(this.filter(this.stations), this.sortedByProperty))
  }

  isLastPage() {
    return this.currentPage >= this.numberOfPages()
  }

  isFirstPage() {
    return this.currentPage == 1
  }

}
