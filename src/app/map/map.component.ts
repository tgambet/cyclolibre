import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat: number = 48.8566458;
  lng: number = 2.3479486;
  zoom: number = 12;

  constructor() { }

  ngOnInit() {
  }

}
