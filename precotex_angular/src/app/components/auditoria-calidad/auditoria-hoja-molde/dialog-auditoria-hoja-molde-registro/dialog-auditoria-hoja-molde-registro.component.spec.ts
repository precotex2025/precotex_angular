import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaHojaMoldeRegistroComponent } from './dialog-auditoria-hoja-molde-registro.component';

describe('DialogAuditoriaHojaMoldeRegistroComponent', () => {
  let component: DialogAuditoriaHojaMoldeRegistroComponent;
  let fixture: ComponentFixture<DialogAuditoriaHojaMoldeRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaHojaMoldeRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaHojaMoldeRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
