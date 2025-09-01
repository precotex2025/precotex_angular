import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfReubicacionCajasComponent } from './cnf-reubicacion-cajas.component';

describe('CnfReubicacionCajasComponent', () => {
  let component: CnfReubicacionCajasComponent;
  let fixture: ComponentFixture<CnfReubicacionCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfReubicacionCajasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfReubicacionCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
