import { TestBed } from '@angular/core/testing';

import { DesarrolloTelaService } from './desarrollo-tela.service';

describe('DesarrolloTelaService', () => {
  let service: DesarrolloTelaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesarrolloTelaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
