import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNcResolvedorComponent } from './reporte-nc-resolvedor.component';

describe('ReporteNcResolvedorComponent', () => {
  let component: ReporteNcResolvedorComponent;
  let fixture: ComponentFixture<ReporteNcResolvedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNcResolvedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNcResolvedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
