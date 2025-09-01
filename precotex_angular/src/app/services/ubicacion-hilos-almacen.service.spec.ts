import { TestBed } from '@angular/core/testing';

import { UbicacionHilosAlmacenService } from './ubicacion-hilos-almacen.service';

describe('UbicacionHilosAlmacenService', () => {
  let service: UbicacionHilosAlmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicacionHilosAlmacenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
