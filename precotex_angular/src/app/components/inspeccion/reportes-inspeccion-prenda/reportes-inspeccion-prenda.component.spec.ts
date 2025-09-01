import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesInspeccionPrendaComponent } from './reportes-inspeccion-prenda.component';

describe('ReportesInspeccionPrendaComponent', () => {
  let component: ReportesInspeccionPrendaComponent;
  let fixture: ComponentFixture<ReportesInspeccionPrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesInspeccionPrendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesInspeccionPrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
