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

  contracts: Contract[] = [];

  error: string

  ngOnInit() {
    this.jcDecauxService.getContracts().then(
      contracts => this.contracts = contracts,
      error => this.error = error.statusText
    )
  }

  onChange(name: string) {
    this.router.navigate(['/' + name.toLowerCase()]);
  }

}
