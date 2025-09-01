import { TestBed } from '@angular/core/testing';

import { SeguridadRondasService } from './seguridad-rondas.service';

describe('SeguridadRondasService', () => {
  let service: SeguridadRondasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguridadRondasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
