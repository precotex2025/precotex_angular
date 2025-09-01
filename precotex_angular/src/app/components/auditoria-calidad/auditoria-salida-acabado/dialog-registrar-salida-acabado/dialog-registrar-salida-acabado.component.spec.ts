import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarSalidaAcabadoComponent } from './dialog-registrar-salida-acabado.component';

describe('DialogRegistrarSalidaAcabadoComponent', () => {
  let component: DialogRegistrarSalidaAcabadoComponent;
  let fixture: ComponentFixture<DialogRegistrarSalidaAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarSalidaAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarSalidaAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
