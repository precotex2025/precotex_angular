import { TestBed } from '@angular/core/testing';

import { DialogLiquidacionCorteService } from './dialog-liquidacion-corte.service';

describe('DialogLiquidacionCorteService', () => {
  let service: DialogLiquidacionCorteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogLiquidacionCorteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
