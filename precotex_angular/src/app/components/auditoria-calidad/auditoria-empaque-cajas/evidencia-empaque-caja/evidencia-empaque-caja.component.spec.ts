import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaEmpaqueCajaComponent } from './evidencia-empaque-caja.component';

describe('EvidenciaEmpaqueCajaComponent', () => {
  let component: EvidenciaEmpaqueCajaComponent;
  let fixture: ComponentFixture<EvidenciaEmpaqueCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvidenciaEmpaqueCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenciaEmpaqueCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
