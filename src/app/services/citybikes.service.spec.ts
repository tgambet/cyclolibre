import { TestBed, inject } from '@angular/core/testing';

import { CitybikesService } from './citybikes.service';

describe('CitybikesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitybikesService]
    });
  });

  it('should be created', inject([CitybikesService], (service: CitybikesService) => {
    expect(service).toBeTruthy();
  }));
});
