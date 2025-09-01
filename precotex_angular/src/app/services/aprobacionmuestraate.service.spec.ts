import { TestBed } from '@angular/core/testing';

import { AprobacionmuestraateService } from './aprobacionmuestraate.service';

describe('AprobacionmuestraateService', () => {
  let service: AprobacionmuestraateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprobacionmuestraateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
