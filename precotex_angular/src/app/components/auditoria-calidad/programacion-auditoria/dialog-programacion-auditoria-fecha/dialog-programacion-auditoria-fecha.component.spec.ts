import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProgramacionAuditoriaFechaComponent } from './dialog-programacion-auditoria-fecha.component';

describe('DialogProgramacionAuditoriaFechaComponent', () => {
  let component: DialogProgramacionAuditoriaFechaComponent;
  let fixture: ComponentFixture<DialogProgramacionAuditoriaFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProgramacionAuditoriaFechaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProgramacionAuditoriaFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
