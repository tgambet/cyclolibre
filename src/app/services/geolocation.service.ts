import { Injectable } from '@angular/core';

@Injectable()
export class GeolocationService {

  constructor() { }

  getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => resolve(position),
          (error: PositionError) => reject(error.message)
        )
      } else {
        reject("No geolocation available")
      }
    })
  }

  watchPosition(a: () => void) {

  }

}
