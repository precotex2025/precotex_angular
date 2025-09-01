import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDefectosSalidaAcabadoComponent } from './dialog-defectos-salida-acabado.component';

describe('DialogDefectosSalidaAcabadoComponent', () => {
  let component: DialogDefectosSalidaAcabadoComponent;
  let fixture: ComponentFixture<DialogDefectosSalidaAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDefectosSalidaAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDefectosSalidaAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
