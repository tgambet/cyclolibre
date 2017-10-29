import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

import * as _ from 'lodash';

import { CitybikesService, Network } from '../services/citybikes.service';
import { GeolocationService } from '../services/geolocation.service';

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
    private geolocation: GeolocationService,
    private titleService: Title,
  ) {}

  networks: Network[]

  error: string
  warning: string

  ngOnInit() {
    this.titleService.setTitle('CycloLibre')
    this.citybikesService.getNetworks().then(networks => this.networks = networks)
  }

  filter: string = ""

  filteredNetworks(max: number): Network[] {
    if (!this.networks) return [];
    let filterBase: (network: Network) => string = (network: Network) => {
      let base = network.name + network.location.city + network.id;
      return this.accentsTidy(base.toLowerCase());
    }

    let filter = this.accentsTidy(this.filter.toLowerCase());

    return _.filter(this.networks, (network: Network) => {
      if (!network['base'])
        network['base'] = filterBase(network)
      return network['base'].includes(filter);
    }).slice(0, max);
  }

  accentsTidy(s) {
    var map = [
        ["\\s", ""],
        ["[àáâãäå]", "a"],
        //["æ", "ae"],
        ["ç", "c"],
        ["[èéêë]", "e"],
        ["[ìíîï]", "i"],
        ["ñ", "n"],
        ["[òóôõö]", "o"],
        //["œ", "oe"],
        ["[ùúûü]", "u"],
        ["[ýÿ]", "y"],
        ["\\W", ""]
    ];
    for (var i=0; i<map.length; ++i) {
        s = s.replace(new RegExp(map[i][0], "gi"), function(match) {
            if (match.toUpperCase() === match) {
                return map[i][1].toUpperCase();
            } else {
                return map[i][1];
            }
        });
    }
    return s;
  }

  isGeolocalizing: boolean = false;

  geoLocalize() {
    if (this.isGeolocalizing)
      return;
    this.isGeolocalizing = true;
    this.geolocation.getCurrentPosition()
        .then((position: Position) => {
          this.isGeolocalizing = false;
          // find closest network and redirect
          let distances = this.networks.map((network: Network) => {
            return {
              distance: this.distance(network.location.latitude, network.location.longitude, position.coords.latitude, position.coords.longitude),
              id: network.id
            }
          })
          let closest = _.orderBy(distances, (obj) => obj.distance)[0]
          // Check that closest is within 50?km from user position
          if (closest.distance < 50) {
            this.router.navigate(['/' + closest.id])
          } else {
            this.warning = "Impossible de trouver une ville supportée dans les 50km de votre position"
          }
        })
        .catch((error) => {
          this.isGeolocalizing = false;
          this.warning = error
        });
  }

  distance(lat1, lon1, lat2, lon2) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

}
