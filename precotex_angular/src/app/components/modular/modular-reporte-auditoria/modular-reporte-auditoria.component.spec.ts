import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReporteAuditoriaComponent } from './modular-reporte-auditoria.component';

describe('ModularReporteAuditoriaComponent', () => {
  let component: ModularReporteAuditoriaComponent;
  let fixture: ComponentFixture<ModularReporteAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReporteAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReporteAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
