import { TestBed } from '@angular/core/testing';

import { SeguridadUsuariosService } from './seguridad-usuarios.service';

describe('SeguridadUsuariosService', () => {
  let service: SeguridadUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguridadUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
