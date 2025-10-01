import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNCComponent } from './reporte-nc.component';

describe('ReporteNCComponent', () => {
  let component: ReporteNCComponent;
  let fixture: ComponentFixture<ReporteNCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
