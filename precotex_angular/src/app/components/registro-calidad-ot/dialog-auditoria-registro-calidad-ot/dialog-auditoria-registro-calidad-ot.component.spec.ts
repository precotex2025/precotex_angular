import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaRegistroCalidadOtComponent } from './dialog-auditoria-registro-calidad-ot.component';

describe('DialogAuditoriaRegistroCalidadOtComponent', () => {
  let component: DialogAuditoriaRegistroCalidadOtComponent;
  let fixture: ComponentFixture<DialogAuditoriaRegistroCalidadOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaRegistroCalidadOtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaRegistroCalidadOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
