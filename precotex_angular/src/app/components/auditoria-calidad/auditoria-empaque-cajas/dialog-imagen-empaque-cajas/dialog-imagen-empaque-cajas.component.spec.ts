import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImagenEmpaqueCajasComponent } from './dialog-imagen-empaque-cajas.component';

describe('DialogImagenEmpaqueCajasComponent', () => {
  let component: DialogImagenEmpaqueCajasComponent;
  let fixture: ComponentFixture<DialogImagenEmpaqueCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogImagenEmpaqueCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImagenEmpaqueCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
