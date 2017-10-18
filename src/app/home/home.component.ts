import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { JcDecauxService, Contract } from '../services/jc-decaux.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jcDecauxService: JcDecauxService
  ) {}

  contracts: { countryCode: string, contracts: Contract[] }[] = []

  countryName = {
    'FR': 'France',
    'SE': 'Suède',
    'ES': 'Espagne',
    'BE': 'Belgique',
    'AU': 'Australie',
    'IE': 'Ireland',
    'RU': 'Russie',
    'NO': 'Norvège',
    'SI': 'Slovénie',
    'LU': 'Luxembourg',
    'JP': 'Japon',
    'LT': 'Lithuanie'
  }

  error: string

  ngOnInit() {
    this.jcDecauxService.getContracts().then(
      contracts => {
        let grouped = _.groupBy(contracts, 'country_code')
        for (let i in grouped) {
          this.contracts.push({
            countryCode: this.countryName[i] ? this.countryName[i] : i,
            contracts: grouped[i]
          })
        }
        this.contracts = _.sortBy(
          //_.sortBy(this.contracts, ['country_code']).reverse(),
          this.contracts,
          (test) => test.contracts.length
        ).reverse();
      },
      error => this.error = error.statusText
    )
  }

  onChange(name: string) {
    this.router.navigate(['/' + name.toLowerCase()]);
  }

}
