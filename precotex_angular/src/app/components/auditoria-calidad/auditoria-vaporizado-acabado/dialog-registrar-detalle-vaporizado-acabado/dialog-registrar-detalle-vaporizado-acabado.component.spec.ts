import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarDetalleVaporizadoAcabadoComponent } from './dialog-registrar-detalle-vaporizado-acabado.component';

describe('DialogRegistrarDetalleVaporizadoAcabadoComponent', () => {
  let component: DialogRegistrarDetalleVaporizadoAcabadoComponent;
  let fixture: ComponentFixture<DialogRegistrarDetalleVaporizadoAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarDetalleVaporizadoAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarDetalleVaporizadoAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
