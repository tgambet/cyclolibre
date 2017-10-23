import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { CitybikesService, Network } from '../services/citybikes.service';

@Injectable()
export class NetworkResolverService implements Resolve<Network> {

  constructor(
    private service: CitybikesService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Network> {

    return this.service
        .getNetwork(route.params['id'])
        .then(network => {
          if (network) {
            return network;
          } else {
            this.router.navigate(['/']);
            return null;
          }
        })
        .catch(err => {
          this.router.navigate(['/']);
          return null;
        })
  }

}
