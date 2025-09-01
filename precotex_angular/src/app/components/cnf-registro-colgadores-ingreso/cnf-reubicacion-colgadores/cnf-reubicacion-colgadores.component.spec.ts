import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfReubicacionColgadoresComponent } from './cnf-reubicacion-colgadores.component';

describe('CnfReubicacionColgadoresComponent', () => {
  let component: CnfReubicacionColgadoresComponent;
  let fixture: ComponentFixture<CnfReubicacionColgadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfReubicacionColgadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfReubicacionColgadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
