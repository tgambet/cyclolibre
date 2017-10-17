import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { JcDecauxService, Station, Contract } from '../services/jc-decaux.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  constructor(
    private jcDecauxService: JcDecauxService,
    private route: ActivatedRoute
  ) { }

  contract: Contract;

  error: string;

  ngOnInit() {
    this.route.data
      .subscribe((data: { contract: Contract }) => {
        this.contract = data.contract
      });
  }

}
