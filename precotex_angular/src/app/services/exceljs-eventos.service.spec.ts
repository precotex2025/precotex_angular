import { TestBed } from '@angular/core/testing';

import { ExceljsEventosService } from './exceljs-eventos.service';

describe('ExceljsEventosService', () => {
  let service: ExceljsEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExceljsEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
