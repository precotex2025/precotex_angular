import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReportesAuditoriaSalidaInspeccionComponent } from './modular-reporte-auditoria-salida-inspeccion.component';

describe('ModularReportesAuditoriaSalidaInspeccionComponent', () => {
  let component: ModularReportesAuditoriaSalidaInspeccionComponent;
  let fixture: ComponentFixture<ModularReportesAuditoriaSalidaInspeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReportesAuditoriaSalidaInspeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReportesAuditoriaSalidaInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
