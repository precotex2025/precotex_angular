import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEvidenciaEmpaqueCajaComponent } from './dialog-evidencia-empaque-caja.component';

describe('DialogEvidenciaEmpaqueCajaComponent', () => {
  let component: DialogEvidenciaEmpaqueCajaComponent;
  let fixture: ComponentFixture<DialogEvidenciaEmpaqueCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEvidenciaEmpaqueCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEvidenciaEmpaqueCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
