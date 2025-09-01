import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleExternoCrearImagenesComponent } from './dialog-detalle-externo-crear-imagenes.component';

describe('DialogDetalleExternoCrearImagenesComponent', () => {
  let component: DialogDetalleExternoCrearImagenesComponent;
  let fixture: ComponentFixture<DialogDetalleExternoCrearImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleExternoCrearImagenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleExternoCrearImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
