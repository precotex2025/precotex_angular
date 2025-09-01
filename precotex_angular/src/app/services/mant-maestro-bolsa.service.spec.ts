import { TestBed } from '@angular/core/testing';

import { MantMaestroBolsaService } from './mant-maestro-bolsa.service';

describe('MantMaestroBolsaService', () => {
  let service: MantMaestroBolsaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantMaestroBolsaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
