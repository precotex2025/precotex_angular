import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularDisgregarPrendaComponent } from './modular-disgregar-prenda.component';

describe('ModularDisgregarPrendaComponent', () => {
  let component: ModularDisgregarPrendaComponent;
  let fixture: ComponentFixture<ModularDisgregarPrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularDisgregarPrendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularDisgregarPrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
