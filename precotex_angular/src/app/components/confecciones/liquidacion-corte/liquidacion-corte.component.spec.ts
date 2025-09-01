import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionCorteComponent } from './liquidacion-corte.component';

describe('LiquidacionCorteComponent', () => {
  let component: LiquidacionCorteComponent;
  let fixture: ComponentFixture<LiquidacionCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidacionCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidacionCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
