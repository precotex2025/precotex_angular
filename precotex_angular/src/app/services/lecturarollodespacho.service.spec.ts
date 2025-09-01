import { TestBed } from '@angular/core/testing';

import { LecturarollodespachoService } from './lecturarollodespacho.service';

describe('LecturarollodespachoService', () => {
  let service: LecturarollodespachoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturarollodespachoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
