import { TestBed } from '@angular/core/testing';

import { LecturaBultosService } from './lectura-bultos.service';

describe('LecturaBultosService', () => {
  let service: LecturaBultosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaBultosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
