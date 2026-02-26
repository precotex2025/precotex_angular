import { TestBed } from '@angular/core/testing';

import { AgendaTelefonicaService } from './agenda-telefonica.service';

describe('AgendaTelefonicaService', () => {
  let service: AgendaTelefonicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaTelefonicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
