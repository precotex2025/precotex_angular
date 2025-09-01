import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVisitasComponent } from './reporte-visitas.component';

describe('ReporteVisitasComponent', () => {
  let component: ReporteVisitasComponent;
  let fixture: ComponentFixture<ReporteVisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVisitasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
