import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title, Meta }                    from '@angular/platform-browser';

import { Network } from '../services/citybikes.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) { }

  network: Network;

  error: string;

  ngOnInit() {
    this.route.data
      .subscribe((data: { network: Network }) => {
        this.network = data.network
      });

    this.titleService.setTitle(`CycloLibre - ${this.network.location.city} (${this.network.name})`)

    this.metaService.addTag({name: "description", content: `Trouvez un vélo en libre service dans la ville de ${this.network.location.city} (${this.network.name})`})
  }

}
