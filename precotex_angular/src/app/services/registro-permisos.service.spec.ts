import { TestBed } from '@angular/core/testing';

import { RegistroPermisosService } from './registro-permisos.service';

describe('RegistroPermisosService', () => {
  let service: RegistroPermisosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroPermisosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
