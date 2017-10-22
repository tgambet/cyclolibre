import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Network } from '../services/citybikes.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  network: Network;

  error: string;

  ngOnInit() {
    this.route.data
      .subscribe((data: { network: Network }) => {
        this.network = data.network
      });
  }

}
