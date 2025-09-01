import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionAuditoriaSeguimientoComponent } from './programacion-auditoria-seguimiento.component';

describe('ProgramacionAuditoriaSeguimientoComponent', () => {
  let component: ProgramacionAuditoriaSeguimientoComponent;
  let fixture: ComponentFixture<ProgramacionAuditoriaSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionAuditoriaSeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionAuditoriaSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
