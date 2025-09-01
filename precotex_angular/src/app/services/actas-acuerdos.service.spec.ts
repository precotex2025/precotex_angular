import { TestBed } from '@angular/core/testing';

import { ActasAcuerdosService } from './actas-acuerdos.service';

describe('ActasAcuerdosService', () => {
  let service: ActasAcuerdosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActasAcuerdosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
