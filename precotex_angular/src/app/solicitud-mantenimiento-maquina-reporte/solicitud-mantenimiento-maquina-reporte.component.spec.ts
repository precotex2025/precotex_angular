import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudMantenimientoMaquinaReporteComponent } from './solicitud-mantenimiento-maquina-reporte.component';

describe('SolicitudMantenimientoMaquinaReporteComponent', () => {
  let component: SolicitudMantenimientoMaquinaReporteComponent;
  let fixture: ComponentFixture<SolicitudMantenimientoMaquinaReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudMantenimientoMaquinaReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudMantenimientoMaquinaReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
