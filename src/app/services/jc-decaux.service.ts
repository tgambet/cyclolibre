import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Injectable()
export class JcDecauxService {

  constructor(
    private http: HttpClient
  ) { }

  contracts: Contract[];

  apiKey = '8d872049485a3cd80d956d3f53aaeda5427d47e4';

  serviceUrl = 'https://api.jcdecaux.com/vls/v1/';

  getContract(contractName: string): Promise<Contract> {
    if (this.contracts) {
      return Promise.resolve(_.find(this.contracts, (contract) => contract.name.toLowerCase() == contractName.toLowerCase()))
    } else {
      return this.getContracts().then(contracts => {
        return _.find(contracts, (contract) => contract.name.toLowerCase() == contractName.toLowerCase())
      })
    }
  }

  getContracts(): Promise<Contract[]> {
    return new Promise((resolve, reject) => {
      if (this.contracts) {
        resolve(this.contracts);
      } else {
        this.http.get(this.serviceUrl + 'contracts?apiKey=' + this.apiKey).subscribe(
          data => {
            let results = [];
            for (let i in data) {
              results.push(data[i]);
            }
            this.contracts = _.sortBy(_.filter(results, {country_code: "FR"}), ["name"]);
            resolve(this.contracts);
          },
          err => reject(err)
        );
      }
    });
  }

  getStations(contractName: string): Promise<Station[]> {
    return new Promise((resolve, reject) => {
      this.http.get(this.serviceUrl + 'stations?apiKey=' + this.apiKey + '&contract=' + contractName).subscribe(
        data => {
          let results = [];
          for (let i in data) {
            results.push(data[i]);
          }
          resolve(results);
        },
        err => reject(err)
      );
    });
  }

}

export interface Contract {
  name: string,
  cities : string[],
  commercial_name: string,
  country_code: string
}

export interface Station {
  number: number,
  contract_name: string,
  name: string,
  address: string,
  position: {
    lat: number,
    lng: number
  },
  banking: boolean,
  bonus: boolean,
  status: string,
  bike_stands: number,
  available_bike_stands: number,
  available_bikes: number,
  last_update: number
}
