import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudMantenimientoMaquinaComponent } from './solicitud-mantenimiento-maquina.component';

describe('SolicitudMantenimientoMaquinaComponent', () => {
  let component: SolicitudMantenimientoMaquinaComponent;
  let fixture: ComponentFixture<SolicitudMantenimientoMaquinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudMantenimientoMaquinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudMantenimientoMaquinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
