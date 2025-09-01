import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleExternoMostrarImagenesComponent } from './dialog-detalle-externo-mostrar-imagenes.component';

describe('DialogDetalleExternoMostrarImagenesComponent', () => {
  let component: DialogDetalleExternoMostrarImagenesComponent;
  let fixture: ComponentFixture<DialogDetalleExternoMostrarImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleExternoMostrarImagenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleExternoMostrarImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
