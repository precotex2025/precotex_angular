import { TestBed } from '@angular/core/testing';

import { LecturaregistroQrService } from './lecturaregistro-qr.service';

describe('LecturaregistroQrService', () => {
  let service: LecturaregistroQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaregistroQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
