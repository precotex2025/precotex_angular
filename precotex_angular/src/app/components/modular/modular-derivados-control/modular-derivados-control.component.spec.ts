import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularDerivadosControlComponent } from './modular-derivados-control.component';

describe('ModularDerivadosControlComponent', () => {
  let component: ModularDerivadosControlComponent;
  let fixture: ComponentFixture<ModularDerivadosControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularDerivadosControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularDerivadosControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
