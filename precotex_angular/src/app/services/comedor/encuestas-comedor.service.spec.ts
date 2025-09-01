import { TestBed } from '@angular/core/testing';

import { EncuestasComedorService } from './encuestas-comedor.service';

describe('EncuestasComedorService', () => {
  let service: EncuestasComedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncuestasComedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
