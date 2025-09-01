import { TestBed } from '@angular/core/testing';

import { MantMaestroBolsaItemService } from './mant-maestro-bolsa-item.service';

describe('MantMaestroBolsaItemService', () => {
  let service: MantMaestroBolsaItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantMaestroBolsaItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
