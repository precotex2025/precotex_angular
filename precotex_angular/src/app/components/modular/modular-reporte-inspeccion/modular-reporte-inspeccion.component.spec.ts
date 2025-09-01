import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReporteInspeccionComponent } from './modular-reporte-inspeccion.component';

describe('ModularReporteInspeccionComponent', () => {
  let component: ModularReporteInspeccionComponent;
  let fixture: ComponentFixture<ModularReporteInspeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReporteInspeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReporteInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
