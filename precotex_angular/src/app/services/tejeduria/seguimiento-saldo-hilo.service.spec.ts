import { TestBed } from '@angular/core/testing';

import { SeguimientoSaldoHiloService } from './seguimiento-saldo-hilo.service';

describe('SeguimientoSaldoHiloService', () => {
  let service: SeguimientoSaldoHiloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoSaldoHiloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
