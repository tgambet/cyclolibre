import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule }     from '@angular/common/http';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { AppComponent } from './app.component';
import { MapExtensionDirective } from './map/map-extension.directive';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { MapComponent } from './map/map.component';

import { JcDecauxService } from './services/jc-decaux.service';
import { ContractComponent } from './contract/contract.component';
import { ContractResolverService } from './contract/contract-resolver.service';
import { TableComponent } from './table/table.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: ':id',
    component: ContractComponent,
    resolve: {
      contract: ContractResolverService
    },
    children: [
      {
        path: '',
        component: MapComponent,
      },
      {
        path: 'table',
        component: TableComponent,
      }
    ]
  },
  //{ path: ':id/table', component: MapComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MapExtensionDirective,
    PageNotFoundComponent,
    AboutComponent,
    HomeComponent,
    NavComponent,
    MapComponent,
    ContractComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCFi9RePFTxmDzbOrrF60_gbX1xS7MYEU8',
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
    JcDecauxService,
    ContractResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
