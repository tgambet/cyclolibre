import { TestBed, inject } from '@angular/core/testing';

import { JcDecauxService } from './jc-decaux.service';

describe('JcDecauxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JcDecauxService]
    });
  });

  it('should be created', inject([JcDecauxService], (service: JcDecauxService) => {
    expect(service).toBeTruthy();
  }));
});
