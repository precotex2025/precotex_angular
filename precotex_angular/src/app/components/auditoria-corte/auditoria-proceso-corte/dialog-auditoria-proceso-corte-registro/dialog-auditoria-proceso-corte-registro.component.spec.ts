import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaProcesoCorteRegistroComponent } from './dialog-auditoria-proceso-corte-registro.component';

describe('DialogAuditoriaProcesoCorteRegistroComponent', () => {
  let component: DialogAuditoriaProcesoCorteRegistroComponent;
  let fixture: ComponentFixture<DialogAuditoriaProcesoCorteRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaProcesoCorteRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaProcesoCorteRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
