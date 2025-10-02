import { TestBed } from '@angular/core/testing';

import { ReporteNCService } from './reporte-nc.service';

describe('ReporteNCService', () => {
  let service: ReporteNCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteNCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
