import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReportesInspeccionDefectoPrendaComponent } from './modular-reporte-inspeccion-defecto-prenda.component';

describe('ModularReportesInspeccionDefectoPrendaComponent', () => {
  let component: ModularReportesInspeccionDefectoPrendaComponent;
  let fixture: ComponentFixture<ModularReportesInspeccionDefectoPrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReportesInspeccionDefectoPrendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReportesInspeccionDefectoPrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
