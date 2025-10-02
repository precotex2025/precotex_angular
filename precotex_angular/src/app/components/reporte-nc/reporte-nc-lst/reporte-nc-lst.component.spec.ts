import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNcLstComponent } from './reporte-nc-lst.component';

describe('ReporteNcLstComponent', () => {
  let component: ReporteNcLstComponent;
  let fixture: ComponentFixture<ReporteNcLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNcLstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNcLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
