import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  contracts: contract[] = [];

  ngOnInit() {
    if (this.contracts.length == 0) {
      this.http.get('https://api.jcdecaux.com/vls/v1/contracts?apiKey=8d872049485a3cd80d956d3f53aaeda5427d47e4').subscribe(data => {
        let results = []
        for (let i in data) {
          results.push(data[i]);
        }
        this.contracts = _.sortBy(_.filter(results, {country_code: "FR"}), ["name"]);
      });
    }
  }

  onChange(name: string) {
    this.router.navigate(['/' + name.toLowerCase()]);
  }

}

interface contract {
  name: string,
  cities : string[],
  commercial_name: string,
  country_code: string
}
