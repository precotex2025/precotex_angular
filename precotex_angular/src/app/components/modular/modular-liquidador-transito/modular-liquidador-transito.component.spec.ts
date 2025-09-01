import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularLiquidadorTransitoComponent } from './modular-liquidador-transito.component';

describe('ModularLiquidadorTransitoComponent', () => {
  let component: ModularLiquidadorTransitoComponent;
  let fixture: ComponentFixture<ModularLiquidadorTransitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularLiquidadorTransitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularLiquidadorTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
