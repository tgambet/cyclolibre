import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { HttpClientModule } from '@angular/common/http';
import { MapExtensionDirective } from './map-extension.directive'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MapExtensionDirective,
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCFi9RePFTxmDzbOrrF60_gbX1xS7MYEU8',
      libraries: ["places"]
    }),
    AgmJsMarkerClustererModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
