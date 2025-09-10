import { TestBed } from '@angular/core/testing';

import { RetiroRepuestosService } from './retiro-repuestos.service';

describe('RetiroRepuestosService', () => {
  let service: RetiroRepuestosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetiroRepuestosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
