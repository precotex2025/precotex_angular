import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHojaMedidaInspComponent } from './auditoria-hoja-medida-insp.component';

describe('AuditoriaHojaMedidaInspComponent', () => {
  let component: AuditoriaHojaMedidaInspComponent;
  let fixture: ComponentFixture<AuditoriaHojaMedidaInspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaHojaMedidaInspComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaHojaMedidaInspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
