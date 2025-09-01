import { TestBed } from '@angular/core/testing';

import { MemoddtService } from './memoddt.service';

describe('MemoddtService', () => {
  let service: MemoddtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoddtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
