import { TestBed } from '@angular/core/testing';

import { LiquidacionCorteService } from './liquidacion-corte.service';

describe('LiquidacionCorteService', () => {
  let service: LiquidacionCorteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidacionCorteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
