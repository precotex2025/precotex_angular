import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInspeccionAuditoriaComponent } from './reporte-inspeccion-auditoria.component';

describe('ReporteInspeccionAuditoriaComponent', () => {
  let component: ReporteInspeccionAuditoriaComponent;
  let fixture: ComponentFixture<ReporteInspeccionAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteInspeccionAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteInspeccionAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
