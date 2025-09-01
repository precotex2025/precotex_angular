import { TestBed } from '@angular/core/testing';

import { RegistroCalidadTejeduriaService } from './registro-calidad-tejeduria.service';

describe('RegistroCalidadTejeduriaService', () => {
  let service: RegistroCalidadTejeduriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroCalidadTejeduriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
