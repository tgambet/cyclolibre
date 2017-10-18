import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JcDecauxService, Station, Contract } from '../services/jc-decaux.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(
    private jcDecauxService: JcDecauxService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.updateDisplayedStations()
  }

  contract: Contract

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

  stationFilter: string = ""

  ngOnInit() {
    this.route.parent.params
        .subscribe((params: Params) => {
          let id = params['id'];
          this.jcDecauxService
              .getStations(id)
              .then(stations => {
                this.stations = stations
                this.updateDisplayedStations()
              })
              .catch(error => this.error = error.statusText);
        });
  }

  getAvailableBikes() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.available_bikes, 0);
  }

  getAvailableBikeStands() {
    return _.reduce(this.stations, (a: number, b: Station) => a + b.available_bike_stands, 0);
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
      return (station.address + ' ' + station.number + ' ' + station.name).toLowerCase();
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
