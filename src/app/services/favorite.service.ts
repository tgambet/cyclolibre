import { Injectable } from '@angular/core';

import { Station } from './citybikes.service';

import * as _ from 'lodash';

@Injectable()
export class FavoriteService {

  constructor() {
    let storedFavorites = window.localStorage.getItem("favorites");
    if (storedFavorites)
      this.favorites = storedFavorites.split(",");
    else
      this.favorites = [];
  }

  private favorites: string[]

  private save() {
    window.localStorage.setItem("favorites", this.favorites.join(","));
  }

  addToFavorite(station: Station) {
    this.favorites.push(station.id);
    this.save();
  }

  removeFromFavorite(station: Station) {
    _.remove(this.favorites, (stationId) => stationId == station.id);
    this.save();
  }

  toggleFavorite(station: Station) {
    if (_.includes(this.favorites, station.id)) {
      this.removeFromFavorite(station);
    } else {
      this.addToFavorite(station);
    }
  }

  isFavorite(station: Station): boolean {
    return _.includes(this.favorites, station.id);
  }

}
