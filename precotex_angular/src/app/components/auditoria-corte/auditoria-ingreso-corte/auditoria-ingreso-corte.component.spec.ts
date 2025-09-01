import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaIngresoCorteComponent } from './auditoria-ingreso-corte.component';

describe('AuditoriaIngresoCorteComponent', () => {
  let component: AuditoriaIngresoCorteComponent;
  let fixture: ComponentFixture<AuditoriaIngresoCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaIngresoCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaIngresoCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
