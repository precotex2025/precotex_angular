import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesOperatividadFichaComponent } from './detalles-operatividad-ficha.component';

describe('DetallesOperatividadFichaComponent', () => {
  let component: DetallesOperatividadFichaComponent;
  let fixture: ComponentFixture<DetallesOperatividadFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesOperatividadFichaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesOperatividadFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
