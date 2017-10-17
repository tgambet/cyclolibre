import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { JcDecauxService, Contract } from '../services/jc-decaux.service';

@Injectable()
export class ContractResolverService implements Resolve<Contract> {

  constructor(
    private jcDecauxService: JcDecauxService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Contract> {

    console.log(route.params['id'])

    return this.jcDecauxService
        .getContract(route.params['id'])
        .then(contract => {
          if (contract) {
            return contract;
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
