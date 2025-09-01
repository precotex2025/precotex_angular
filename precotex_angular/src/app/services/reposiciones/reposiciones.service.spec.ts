import { TestBed } from '@angular/core/testing';

import { ReposicionesService } from './reposiciones.service';

describe('ReposicionesService', () => {
  let service: ReposicionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReposicionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
