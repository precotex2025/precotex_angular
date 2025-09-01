import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHojaMedidaDetalleInspComponent } from './auditoria-hoja-medida-detalle-insp.component';

describe('AuditoriaHojaMedidaDetalleInspComponent', () => {
  let component: AuditoriaHojaMedidaDetalleInspComponent;
  let fixture: ComponentFixture<AuditoriaHojaMedidaDetalleInspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaHojaMedidaDetalleInspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaHojaMedidaDetalleInspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
