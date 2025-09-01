import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReportesAuditoriaProcesoInspeccionComponent } from './modular-reporte-auditoria-proceso-inspeccion.component';

describe('ModularReportesAuditoriaProcesoInspeccionComponent', () => {
  let component: ModularReportesAuditoriaProcesoInspeccionComponent;
  let fixture: ComponentFixture<ModularReportesAuditoriaProcesoInspeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReportesAuditoriaProcesoInspeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReportesAuditoriaProcesoInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
