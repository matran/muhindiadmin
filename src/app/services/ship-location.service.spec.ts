import { TestBed } from '@angular/core/testing';

import { ShipLocationService } from './ship-location.service';

describe('ShipLocationService', () => {
  let service: ShipLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShipLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
