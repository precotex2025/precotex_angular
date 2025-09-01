import { TestBed } from '@angular/core/testing';

import { ArranquetejeduriaService } from './arranquetejeduria.service';

describe('ArranquetejeduriaService', () => {
  let service: ArranquetejeduriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArranquetejeduriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
