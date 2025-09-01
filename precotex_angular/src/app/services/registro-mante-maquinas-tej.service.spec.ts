import { TestBed } from '@angular/core/testing';

import { RegistroManteMaquinasTejService } from './registro-mante-maquinas-tej.service';

describe('RegistroManteMaquinasTejService', () => {
  let service: RegistroManteMaquinasTejService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroManteMaquinasTejService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
