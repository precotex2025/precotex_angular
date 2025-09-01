import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaEmpaqueCajasComponent } from './auditoria-empaque-cajas.component';

describe('AuditoriaEmpaqueCajasComponent', () => {
  let component: AuditoriaEmpaqueCajasComponent;
  let fixture: ComponentFixture<AuditoriaEmpaqueCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaEmpaqueCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaEmpaqueCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
