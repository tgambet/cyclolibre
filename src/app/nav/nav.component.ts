import { Component, OnInit, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isOpen: boolean = false;

  constructor(elementRef: ElementRef, renderer: Renderer) {

  }

  ngOnInit() {

  }

}
