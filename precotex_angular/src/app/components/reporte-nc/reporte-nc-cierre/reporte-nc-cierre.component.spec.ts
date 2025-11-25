import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNcCierreComponent } from './reporte-nc-cierre.component';

describe('ReporteNcCierreComponent', () => {
  let component: ReporteNcCierreComponent;
  let fixture: ComponentFixture<ReporteNcCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNcCierreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNcCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
