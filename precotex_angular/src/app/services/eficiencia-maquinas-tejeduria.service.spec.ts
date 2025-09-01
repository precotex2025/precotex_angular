import { TestBed } from '@angular/core/testing';

import { EficienciaMaquinasTejeduriaService } from './eficiencia-maquinas-tejeduria.service';

describe('EficienciaMaquinasTejeduriaService', () => {
  let service: EficienciaMaquinasTejeduriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EficienciaMaquinasTejeduriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
