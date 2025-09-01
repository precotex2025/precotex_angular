import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfRegistroColgadoresIngresoDetalleComponent } from './cnf-registro-colgadores-ingreso-detalle.component';

describe('CnfRegistroColgadoresIngresoDetalleComponent', () => {
  let component: CnfRegistroColgadoresIngresoDetalleComponent;
  let fixture: ComponentFixture<CnfRegistroColgadoresIngresoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfRegistroColgadoresIngresoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfRegistroColgadoresIngresoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
