import { TestBed } from '@angular/core/testing';
import { TiProcesosTintoreriaService } from './ti-procesos-tintoreria.service';

describe('TiProcesosTintoreriaService', () => {
  let service: TiProcesosTintoreriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiProcesosTintoreriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
