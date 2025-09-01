import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVistaSalidaAcabadoComponent } from './dialog-vista-salida-acabado.component';

describe('DialogVistaSalidaAcabadoComponent', () => {
  let component: DialogVistaSalidaAcabadoComponent;
  let fixture: ComponentFixture<DialogVistaSalidaAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVistaSalidaAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVistaSalidaAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
