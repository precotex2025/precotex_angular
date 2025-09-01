import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaIngresoCorteCabeceraComponent } from './dialog-auditoria-ingreso-corte-cabecera.component';

describe('', () => {
  let component: DialogAuditoriaIngresoCorteCabeceraComponent;
  let fixture: ComponentFixture<DialogAuditoriaIngresoCorteCabeceraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaIngresoCorteCabeceraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaIngresoCorteCabeceraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
