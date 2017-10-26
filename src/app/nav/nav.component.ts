import { Component, OnInit, Input } from '@angular/core';

import { Network } from '../services/citybikes.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isOpen: boolean = false;

  @Input()
  network: any

  constructor() {

  }

  ngOnInit() {

  }

}
