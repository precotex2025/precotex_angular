import { TestBed } from '@angular/core/testing';

import { AprofabriccardService } from './aprofabriccard.service';

describe('AprofabriccardService', () => {
  let service: AprofabriccardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprofabriccardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
