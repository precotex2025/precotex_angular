import { TestBed } from '@angular/core/testing';

import { LiberarpartidacalidadService } from './liberarpartidacalidad.service';

describe('LiberarpartidacalidadService', () => {
  let service: LiberarpartidacalidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiberarpartidacalidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
