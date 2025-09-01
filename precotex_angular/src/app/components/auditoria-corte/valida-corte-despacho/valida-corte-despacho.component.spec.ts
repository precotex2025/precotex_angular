import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidaCorteDespachoComponent } from './valida-corte-despacho.component';

describe('ValidaCorteDespachoComponent', () => {
  let component: ValidaCorteDespachoComponent;
  let fixture: ComponentFixture<ValidaCorteDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidaCorteDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidaCorteDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
