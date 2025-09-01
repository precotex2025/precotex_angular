import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaHojaFinalMedidasComponent } from './dialog-auditoria-hoja-final-medidas.component';

describe('DialogAuditoriaHojaFinalMedidasComponent', () => {
  let component: DialogAuditoriaHojaFinalMedidasComponent;
  let fixture: ComponentFixture<DialogAuditoriaHojaFinalMedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaHojaFinalMedidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaHojaFinalMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
