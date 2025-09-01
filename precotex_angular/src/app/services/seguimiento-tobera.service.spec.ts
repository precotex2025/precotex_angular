import { TestBed } from '@angular/core/testing';

import { SeguimientoToberaService } from './seguimiento-tobera.service';

describe('SeguimientoToberaService', () => {
  let service: SeguimientoToberaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoToberaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
