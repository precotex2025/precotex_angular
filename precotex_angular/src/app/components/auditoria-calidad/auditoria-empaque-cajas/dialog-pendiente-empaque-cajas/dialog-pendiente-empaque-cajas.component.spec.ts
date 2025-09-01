import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPendienteEmpaqueCajasComponent } from './dialog-pendiente-empaque-cajas.component';

describe('DialogPendienteEmpaqueCajasComponent', () => {
  let component: DialogPendienteEmpaqueCajasComponent;
  let fixture: ComponentFixture<DialogPendienteEmpaqueCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPendienteEmpaqueCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPendienteEmpaqueCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
