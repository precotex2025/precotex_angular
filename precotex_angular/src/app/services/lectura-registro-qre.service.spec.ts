import { TestBed } from '@angular/core/testing';

import { LecturaRegistroQreService } from './lectura-registro-qre.service';

describe('LecturaRegistroQreService', () => {
  let service: LecturaRegistroQreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaRegistroQreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
