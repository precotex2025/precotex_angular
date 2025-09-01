import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDefectosEmpaqueCajasComponent } from './dialog-defectos-empaque-cajas.component';

describe('DialogDefectosEmpaqueCajasComponent', () => {
  let component: DialogDefectosEmpaqueCajasComponent;
  let fixture: ComponentFixture<DialogDefectosEmpaqueCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDefectosEmpaqueCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDefectosEmpaqueCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
