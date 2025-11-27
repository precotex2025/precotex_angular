import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiemposImproductivosv3Component } from './tiempos-improductivosv3.component';

describe('TiemposImproductivosv3Component', () => {
  let component: TiemposImproductivosv3Component;
  let fixture: ComponentFixture<TiemposImproductivosv3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiemposImproductivosv3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiemposImproductivosv3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
