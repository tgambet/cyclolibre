import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment'

import * as _ from 'lodash';

@Injectable()
export class CitybikesService {

  constructor(
    private http: HttpClient
  ) { }

  networks: Network[]

  serviceUrl = 'https://api.citybik.es'

  getNetwork(id: string): Promise<Network> {
    if (this.networks) {
      return Promise.resolve(_.find(this.networks, (network) => network.id.toLowerCase() == id.toLowerCase()))
    } else {
      return this.getNetworks().then(networks => {
        return _.find(networks, (network) => network.id.toLowerCase() == id.toLowerCase())
      })
    }
  }

  getNetworks(): Promise<Network[]> {
    return new Promise((resolve, reject) => {
      if (this.networks) {
        resolve(this.networks);
      } else {
        this.http.get(`${this.serviceUrl}/v2/networks`).subscribe(
          data => {
            // let results = [];
            // for (let i in data) {
            //   results.push(data[i]);
            // }
            this.networks = data['networks'] as Network[];
            resolve(this.networks);
          },
          err => reject(err)
        );
      }
    });
  }

  getStations(network: Network): Promise<Station[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.serviceUrl}/v2/networks/${network.id}?fields=stations`).subscribe(
        data => {
          // let stations = [];
          // for (let i in data['network']['stations']) {
          //   stations.push(data[i]);
          // }
          resolve(data['network']['stations']);
        },
        err => reject(err)
      );
    });
  }

}

export interface Network {
  id: string,
  name: string,
  company: string[],
  href: string,
  location: {
    city: string,
    country: string
    latitude: number,
    longitude: number,
  }
}

export interface Station {
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  free_bikes: number,
  empty_slots: number,
  timestamp: string,
  extra?: object
}
