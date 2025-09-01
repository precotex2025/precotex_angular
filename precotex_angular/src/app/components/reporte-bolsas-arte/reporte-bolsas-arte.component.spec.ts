import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteBolsasArteComponent } from './reporte-bolsas-arte.component';

describe('ReporteBolsasArteComponent', () => {
  let component: ReporteBolsasArteComponent;
  let fixture: ComponentFixture<ReporteBolsasArteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteBolsasArteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteBolsasArteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
