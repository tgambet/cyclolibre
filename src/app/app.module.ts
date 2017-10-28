import { NgModule }             from '@angular/core';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }     from '@angular/common/http';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { MapComponent } from './map/map.component';
import { NetworkComponent } from './network/network.component';
import { ListComponent } from './list/list.component';

import { CitybikesService } from './services/citybikes.service';
import { NetworkResolverService } from './network/network-resolver.service';
import { FavoriteService } from './services/favorite.service';
import { GeolocationService } from './services/geolocation.service';

import { environment } from '../environments/environment';
import { LicenseComponent } from './license/license.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'license', component: LicenseComponent },
  {
    path: ':id',
    component: NetworkComponent,
    resolve: {
      network: NetworkResolverService
    },
    children: [
      {
        path: '',
        component: MapComponent,
      },
      {
        path: 'list',
        component: ListComponent,
      }
    ]
  },
  //{ path: ':id/table', component: MapComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AboutComponent,
    HomeComponent,
    NavComponent,
    MapComponent,
    NetworkComponent,
    ListComponent,
    LicenseComponent,
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.gmApiKey,
      libraries: ["places"]
    }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    GoogleMapsAPIWrapper,
    CitybikesService,
    FavoriteService,
    GeolocationService,
    NetworkResolverService,
    Title,
    Meta
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
