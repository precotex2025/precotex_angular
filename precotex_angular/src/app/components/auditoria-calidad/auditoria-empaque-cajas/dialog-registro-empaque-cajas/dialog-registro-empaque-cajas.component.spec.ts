import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroEmpaqueCajasComponent } from './dialog-registro-empaque-cajas.component';

describe('DialogRegistroEmpaqueCajasComponent', () => {
  let component: DialogRegistroEmpaqueCajasComponent;
  let fixture: ComponentFixture<DialogRegistroEmpaqueCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistroEmpaqueCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistroEmpaqueCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
