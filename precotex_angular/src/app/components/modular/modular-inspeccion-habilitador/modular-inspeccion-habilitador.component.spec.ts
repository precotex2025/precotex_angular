import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularInspeccionHabilitadorComponent } from './modular-inspeccion-habilitador.component';

describe('ModularInspeccionHabilitadorComponent', () => {
  let component: ModularInspeccionHabilitadorComponent;
  let fixture: ComponentFixture<ModularInspeccionHabilitadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularInspeccionHabilitadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularInspeccionHabilitadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
