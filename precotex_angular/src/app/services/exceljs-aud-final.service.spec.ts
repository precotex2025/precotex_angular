import { TestBed } from '@angular/core/testing';

import { ExceljsAudFinalService } from './exceljs-aud-final.service';

describe('ExceljsAudFinalService', () => {
  let service: ExceljsAudFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExceljsAudFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
