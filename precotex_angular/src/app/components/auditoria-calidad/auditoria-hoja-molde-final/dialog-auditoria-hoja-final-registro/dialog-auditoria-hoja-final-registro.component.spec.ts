import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaHojaFinalRegistroComponent } from './dialog-auditoria-hoja-final-registro.component';

describe('DialogAuditoriaHojaFinalRegistroComponent', () => {
  let component: DialogAuditoriaHojaFinalRegistroComponent;
  let fixture: ComponentFixture<DialogAuditoriaHojaFinalRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaHojaFinalRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaHojaFinalRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
