import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularInspeccionRecuperacionComponent } from './modular-inspeccion-recuperacion.component';

describe('ModularInspeccionRecuperacionComponent', () => {
  let component: ModularInspeccionRecuperacionComponent;
  let fixture: ComponentFixture<ModularInspeccionRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularInspeccionRecuperacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularInspeccionRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
