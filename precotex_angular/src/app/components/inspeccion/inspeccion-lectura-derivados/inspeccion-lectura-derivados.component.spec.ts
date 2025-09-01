import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspeccionLecturaDerivadosComponent } from './inspeccion-lectura-derivados.component';

describe('InspeccionLecturaDerivadosComponent', () => {
  let component: InspeccionLecturaDerivadosComponent;
  let fixture: ComponentFixture<InspeccionLecturaDerivadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspeccionLecturaDerivadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionLecturaDerivadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
