import { TestBed } from '@angular/core/testing';

import { PrimerapartidaService } from './primerapartida.service';

describe('PrimerapartidaService', () => {
  let service: PrimerapartidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimerapartidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
