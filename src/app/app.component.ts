import { Component, Directive } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { } from 'googlemaps';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  lat: number = 48.8566458;
  lng: number = 2.3479486;
  zoom: number = 12;

  typeLooked: string = "bike";

}
