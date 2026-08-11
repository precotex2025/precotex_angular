import { TestBed } from '@angular/core/testing';

import { RegistroUsuarioLaboratorioService } from './registro-usuario-laboratorio.service';

describe('RegistroUsuarioLaboratorioService', () => {
  let service: RegistroUsuarioLaboratorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroUsuarioLaboratorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
