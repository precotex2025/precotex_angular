import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionPendientesComponent } from './liquidacion-pendientes.component';

describe('LiquidacionPendientesComponent', () => {
  let component: LiquidacionPendientesComponent;
  let fixture: ComponentFixture<LiquidacionPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionPendientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
