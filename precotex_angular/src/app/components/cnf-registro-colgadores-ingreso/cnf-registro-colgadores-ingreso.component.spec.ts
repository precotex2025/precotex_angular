import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfRegistroColgadoresIngresoComponent } from './cnf-registro-colgadores-ingreso.component';

describe('CnfRegistroColgadoresIngresoComponent', () => {
  let component: CnfRegistroColgadoresIngresoComponent;
  let fixture: ComponentFixture<CnfRegistroColgadoresIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfRegistroColgadoresIngresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfRegistroColgadoresIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
