import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaSalidaAcabadoComponent } from './auditoria-salida-acabado.component';

describe('AuditoriaSalidaAcabadoComponent', () => {
  let component: AuditoriaSalidaAcabadoComponent;
  let fixture: ComponentFixture<AuditoriaSalidaAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaSalidaAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaSalidaAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
