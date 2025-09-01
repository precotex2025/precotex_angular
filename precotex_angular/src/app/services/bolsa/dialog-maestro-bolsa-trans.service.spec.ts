import { TestBed } from '@angular/core/testing';

import { DialogMaestroBolsaTransService } from './dialog-maestro-bolsa-trans.service';

describe('DialogMaestroBolsaTransService', () => {
  let service: DialogMaestroBolsaTransService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogMaestroBolsaTransService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
