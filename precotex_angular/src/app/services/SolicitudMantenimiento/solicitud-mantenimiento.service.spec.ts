import { TestBed } from '@angular/core/testing';

import { SolicitudMantenimientoService } from './solicitud-mantenimiento.service';

describe('SolicitudMantenimientoService', () => {
  let service: SolicitudMantenimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudMantenimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
