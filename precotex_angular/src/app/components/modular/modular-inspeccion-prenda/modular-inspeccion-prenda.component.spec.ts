import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularInspeccionPrendaComponent } from './modular-inspeccion-prenda.component';

describe('ModularInspeccionPrendaComponent', () => {
  let component: ModularInspeccionPrendaComponent;
  let fixture: ComponentFixture<ModularInspeccionPrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularInspeccionPrendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularInspeccionPrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
