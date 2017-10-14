import { Component, Directive } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private wrapper: GoogleMapsAPIWrapper,
    private mapsAPILoader: MapsAPILoader
  ) {}

  ngOnInit(): void {
    this.http.get('https://api.jcdecaux.com/vls/v1/stations?contract=Paris&apiKey=8d872049485a3cd80d956d3f53aaeda5427d47e4').subscribe(data => {
      for (let i in data) {
        this.stations.push(data[i]);
      }
    });
    this.mapsAPILoader.load().then(() => {
      //console.log( google)
      // var bikeLayer = new google.maps.BicyclingLayer();
      // console.log(bikeLayer);
      //this.wrapper.getNativeMap().then((map) => console.log(map))
    });
  }

  title = 'Vélo Libre';
  lat: number = 48.8566458;
  lng: number = 2.3479486;
  zoom: number = 12;
  typeLooked: string = "bike";

  imagePath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  iconUrl = "assets/icon-1.svg";

  stations: station[] = []

  getAvailableBikes() {
    return _.reduce(this.stations, (a: number, b: station) => a + b.available_bikes, 0);
  }

  getAvailableBikeStands() {
    return _.reduce(this.stations, (a: number, b: station) => a + b.available_bike_stands, 0);
  }

  clickedStation(stationNumber: string, index: number) {
    console.log(`clicked the marker: ${stationNumber || index}`)
  }

  icon(s: station) {
    if (s.status == "CLOSED") {
      return 'assets/icon.svg';
    }
    let percentage = this.typeLooked == "bike" ? s.available_bikes / s.bike_stands : s.available_bike_stands / s.bike_stands;
    if (percentage > 0.75)
      return 'assets/icon-4.svg';
    if (percentage > 0.50)
      return 'assets/icon-3.svg';
    if (percentage > 0.25)
      return 'assets/icon-2.svg';
    if (percentage > 0)
      return 'assets/icon-1.svg';
    return 'assets/icon-0.svg';
  }

}

interface station {
  number: number,
  contract_name : string,
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
