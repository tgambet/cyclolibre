import { Component, OnInit, ElementRef, Renderer, Input } from '@angular/core';

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

  constructor(elementRef: ElementRef, renderer: Renderer) {

  }

  ngOnInit() {

  }

}
