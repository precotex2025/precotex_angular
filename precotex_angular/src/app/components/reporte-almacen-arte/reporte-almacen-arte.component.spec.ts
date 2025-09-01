import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAlmacenArteComponent } from './reporte-almacen-arte.component';

describe('ReporteAlmacenArteComponent', () => {
  let component: ReporteAlmacenArteComponent;
  let fixture: ComponentFixture<ReporteAlmacenArteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteAlmacenArteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAlmacenArteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
