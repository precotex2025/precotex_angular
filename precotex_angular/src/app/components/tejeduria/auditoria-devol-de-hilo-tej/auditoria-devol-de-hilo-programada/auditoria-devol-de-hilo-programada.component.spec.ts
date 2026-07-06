import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaDevolDeHiloProgramadaComponent } from './auditoria-devol-de-hilo-programada.component';

describe('AuditoriaDevolDeHiloProgramadaComponent', () => {
  let component: AuditoriaDevolDeHiloProgramadaComponent;
  let fixture: ComponentFixture<AuditoriaDevolDeHiloProgramadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditoriaDevolDeHiloProgramadaComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaDevolDeHiloProgramadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
