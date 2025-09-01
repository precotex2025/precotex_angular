import { TestBed } from '@angular/core/testing';

import { ComercialService } from './comercial.service';

describe('ComercialService', () => {
  let service: ComercialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComercialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
