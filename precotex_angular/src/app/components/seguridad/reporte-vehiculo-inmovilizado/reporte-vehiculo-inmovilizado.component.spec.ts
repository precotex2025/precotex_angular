import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVehiculoInmovilizadoComponent } from './reporte-vehiculo-inmovilizado.component';

describe('ReporteVehiculoInmovilizadoComponent', () => {
  let component: ReporteVehiculoInmovilizadoComponent;
  let fixture: ComponentFixture<ReporteVehiculoInmovilizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVehiculoInmovilizadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVehiculoInmovilizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
