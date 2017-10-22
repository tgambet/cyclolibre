import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { JcDecauxService, Contract } from '../services/jc-decaux.service';
import { CitybikesService, Network } from '../services/citybikes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private citybikesService: CitybikesService,
  ) {}

  networks: Network[]

  error: string

  ngOnInit() {
    this.citybikesService.getNetworks().then(networks => this.networks = networks)
  }

  filter: string = ""

  filteredNetworks(max: number): Network[] {
    if (!this.networks) return [];
    return _.filter(this.networks, (network: Network) => {
      return (network.name + ' ' + network.location.city).toLowerCase().includes(this.filter.toLowerCase());
    }).slice(0, max);
  }

}
