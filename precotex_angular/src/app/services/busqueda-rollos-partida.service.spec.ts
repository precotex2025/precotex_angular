import { TestBed } from '@angular/core/testing';

import { BusquedaRollosPartidaService } from './busqueda-rollos-partida.service';

describe('BusquedaRollosPartidaService', () => {
  let service: BusquedaRollosPartidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusquedaRollosPartidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
