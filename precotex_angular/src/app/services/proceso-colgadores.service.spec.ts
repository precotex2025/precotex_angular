import { TestBed } from '@angular/core/testing';

import { ProcesoColgadoresService } from './proceso-colgadores.service';

describe('ProcesoColgadoresService', () => {
  let service: ProcesoColgadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesoColgadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
