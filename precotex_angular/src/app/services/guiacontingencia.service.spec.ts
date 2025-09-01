import { TestBed } from '@angular/core/testing';

import { GuiacontingenciaService } from './guiacontingencia.service';

describe('GuiacontingenciaService', () => {
  let service: GuiacontingenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuiacontingenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
