import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularLiquidacionAdicionalComponent } from './modular-liquidacion-adicional.component';

describe('ModularLiquidacionAdicionalComponent', () => {
  let component: ModularLiquidacionAdicionalComponent;
  let fixture: ComponentFixture<ModularLiquidacionAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularLiquidacionAdicionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularLiquidacionAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
