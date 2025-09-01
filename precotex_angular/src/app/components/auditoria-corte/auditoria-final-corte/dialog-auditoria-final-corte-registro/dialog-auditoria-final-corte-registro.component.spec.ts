import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaFinalCorteRegistroComponent } from './dialog-auditoria-final-corte-registro.component';

describe('DialogAuditoriaFinalCorteRegistroComponent', () => {
  let component: DialogAuditoriaFinalCorteRegistroComponent;
  let fixture: ComponentFixture<DialogAuditoriaFinalCorteRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaFinalCorteRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaFinalCorteRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
