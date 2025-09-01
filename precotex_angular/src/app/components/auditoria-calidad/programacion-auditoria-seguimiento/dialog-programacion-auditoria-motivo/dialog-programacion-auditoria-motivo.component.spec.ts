import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProgramacionAuditoriaMotivoComponent } from './dialog-programacion-auditoria-motivo.component';

describe('DialogProgramacionAuditoriaMotivoComponent', () => {
  let component: DialogProgramacionAuditoriaMotivoComponent;
  let fixture: ComponentFixture<DialogProgramacionAuditoriaMotivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProgramacionAuditoriaMotivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProgramacionAuditoriaMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
