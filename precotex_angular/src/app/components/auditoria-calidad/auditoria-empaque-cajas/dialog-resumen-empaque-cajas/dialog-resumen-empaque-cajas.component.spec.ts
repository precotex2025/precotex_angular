import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResumenEmpaqueCajasComponent } from './dialog-resumen-empaque-cajas.component';

describe('DialogResumenEmpaqueCajasComponent', () => {
  let component: DialogResumenEmpaqueCajasComponent;
  let fixture: ComponentFixture<DialogResumenEmpaqueCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResumenEmpaqueCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResumenEmpaqueCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
