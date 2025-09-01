import { TestBed } from '@angular/core/testing';

import { SeguridadVisitasService } from './seguridad-visitas.service';

describe('SeguridadVisitasService', () => {
  let service: SeguridadVisitasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguridadVisitasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
