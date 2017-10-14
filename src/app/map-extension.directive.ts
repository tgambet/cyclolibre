import { Directive } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';

@Directive({
  selector: '[appMapExtension]'
})
export class MapExtensionDirective {

  constructor(private wrapper: GoogleMapsAPIWrapper) {}

  ngAfterViewInit() {
    this.wrapper.getNativeMap().then((m) => {
      var bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(m as any);
    }, err=>{
      console.log('error', err);
    })
  }
}
