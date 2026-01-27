import { TestBed } from '@angular/core/testing';

import { VisoresGeneralesService } from './visores-generales.service';

describe('VisoresGeneralesService', () => {
  let service: VisoresGeneralesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisoresGeneralesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
