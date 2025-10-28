import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudMantenimientoMaquinaVisorComponent } from './solicitud-mantenimiento-maquina-visor.component';

describe('SolicitudMantenimientoMaquinaVisorComponent', () => {
  let component: SolicitudMantenimientoMaquinaVisorComponent;
  let fixture: ComponentFixture<SolicitudMantenimientoMaquinaVisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudMantenimientoMaquinaVisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudMantenimientoMaquinaVisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
