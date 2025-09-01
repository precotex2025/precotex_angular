import { TestBed } from '@angular/core/testing';

import { Lecturaq2ah4Service } from './lecturaq2ah4.service';

describe('Lecturaq2ah4Service', () => {
  let service: Lecturaq2ah4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lecturaq2ah4Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
