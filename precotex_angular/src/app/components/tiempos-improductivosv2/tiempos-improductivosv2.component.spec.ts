import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiemposImproductivosv2Component } from './tiempos-improductivosv2.component';

describe('TiemposImproductivosv2Component', () => {
  let component: TiemposImproductivosv2Component;
  let fixture: ComponentFixture<TiemposImproductivosv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiemposImproductivosv2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiemposImproductivosv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
