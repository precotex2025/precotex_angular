import { TestBed } from '@angular/core/testing';

import { LecturaBultosAlmacenService } from './lectura-bultos-almacen.service';

describe('LecturaBultosAlmacenService', () => {
  let service: LecturaBultosAlmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaBultosAlmacenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
