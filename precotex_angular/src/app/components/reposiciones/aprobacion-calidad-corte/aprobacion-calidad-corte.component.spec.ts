import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionCalidadCorteComponent } from './aprobacion-calidad-corte.component';

describe('AprobacionCalidadCorteComponent', () => {
  let component: AprobacionCalidadCorteComponent;
  let fixture: ComponentFixture<AprobacionCalidadCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionCalidadCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionCalidadCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
