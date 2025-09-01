import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadActivoFijoReporteComponent } from './seguridad-activo-fijo-reporte.component';

describe('SeguridadActivoFijoReporteComponent', () => {
  let component: SeguridadActivoFijoReporteComponent;
  let fixture: ComponentFixture<SeguridadActivoFijoReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguridadActivoFijoReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguridadActivoFijoReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
