import { TestBed } from '@angular/core/testing';

import { TomaFotoService } from './toma-foto.service';

describe('TomaFotoService', () => {
  let service: TomaFotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TomaFotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
