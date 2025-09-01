import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProgramacionAuditoriaRegistroComponent } from './dialog-programacion-auditoria-registro.component';

describe('DialogProgramacionAuditoriaRegistroComponent', () => {
  let component: DialogProgramacionAuditoriaRegistroComponent;
  let fixture: ComponentFixture<DialogProgramacionAuditoriaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProgramacionAuditoriaRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProgramacionAuditoriaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
