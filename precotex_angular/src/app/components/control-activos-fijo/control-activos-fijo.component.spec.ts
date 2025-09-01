import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlActivosFijoComponent } from './control-activos-fijo.component';

describe('ControlActivosFijoComponent', () => {
  let component: ControlActivosFijoComponent;
  let fixture: ComponentFixture<ControlActivosFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlActivosFijoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlActivosFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
