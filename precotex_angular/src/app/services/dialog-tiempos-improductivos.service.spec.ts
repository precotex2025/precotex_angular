import { TestBed } from '@angular/core/testing';

import { DialogTiemposImproductivosService } from './dialog-tiempos-improductivos.service';

describe('DialogTiemposImproductivosService', () => {
  let service: DialogTiemposImproductivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogTiemposImproductivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
