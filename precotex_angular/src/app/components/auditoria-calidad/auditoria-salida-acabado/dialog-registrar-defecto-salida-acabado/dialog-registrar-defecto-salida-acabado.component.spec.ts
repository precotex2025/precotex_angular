import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarDefectoSalidaAcabadoComponent } from './dialog-registrar-defecto-salida-acabado.component';

describe('DialogRegistrarDefectoSalidaAcabadoComponent', () => {
  let component: DialogRegistrarDefectoSalidaAcabadoComponent;
  let fixture: ComponentFixture<DialogRegistrarDefectoSalidaAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarDefectoSalidaAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarDefectoSalidaAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
