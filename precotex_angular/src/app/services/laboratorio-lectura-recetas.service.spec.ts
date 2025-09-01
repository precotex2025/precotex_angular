import { TestBed } from '@angular/core/testing';

import { LaboratorioLecturaRecetasService } from './laboratorio-lectura-recetas.service';

describe('LaboratorioLecturaRecetasService', () => {
  let service: LaboratorioLecturaRecetasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorioLecturaRecetasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
