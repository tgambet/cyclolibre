import { Component, OnInit, ElementRef, Renderer, Input } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isOpen: boolean = false;

  @Input()
  networkName: string

  @Input()
  networkCity: string

  constructor(elementRef: ElementRef, renderer: Renderer) {

  }

  ngOnInit() {

  }

}
