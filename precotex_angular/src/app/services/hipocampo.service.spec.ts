import { TestBed } from '@angular/core/testing';

import { HipocampoService } from './hipocampo.service';

describe('HipocampoService', () => {
  let service: HipocampoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HipocampoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
