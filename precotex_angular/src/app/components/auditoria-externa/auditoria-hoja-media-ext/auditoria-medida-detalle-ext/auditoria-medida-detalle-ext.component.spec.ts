import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaMedidaDetalleExtComponent } from './auditoria-medida-detalle-ext.component';

describe('AuditoriaMedidaDetalleExtComponent', () => {
  let component: AuditoriaMedidaDetalleExtComponent;
  let fixture: ComponentFixture<AuditoriaMedidaDetalleExtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaMedidaDetalleExtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaMedidaDetalleExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
