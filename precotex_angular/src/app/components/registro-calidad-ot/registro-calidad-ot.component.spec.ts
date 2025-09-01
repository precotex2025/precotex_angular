import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCalidadOtComponent } from './registro-calidad-ot.component';

describe('RegistroCalidadOtComponent', () => {
  let component: RegistroCalidadOtComponent;
  let fixture: ComponentFixture<RegistroCalidadOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCalidadOtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCalidadOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
