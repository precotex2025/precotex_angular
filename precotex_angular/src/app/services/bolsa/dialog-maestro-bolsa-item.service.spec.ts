import { TestBed } from '@angular/core/testing';

import { DialogMaestroBolsaItemService } from './dialog-maestro-bolsa-item.service';

describe('DialogMaestroBolsaItemService', () => {
  let service: DialogMaestroBolsaItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogMaestroBolsaItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
