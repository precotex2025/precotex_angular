import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiemposImproductivosComponent } from './tiempos-improductivos.component';

describe('TiemposImproductivosComponent', () => {
  let component: TiemposImproductivosComponent;
  let fixture: ComponentFixture<TiemposImproductivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiemposImproductivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiemposImproductivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
