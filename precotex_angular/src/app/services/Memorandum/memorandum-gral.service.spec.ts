import { TestBed } from '@angular/core/testing';

import { MemorandumGralService } from './memorandum-gral.service'

describe('MemorandumGralService', () => {
  let service: MemorandumGralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemorandumGralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
