import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarSedeAccionComponent } from './seleccionar-sede-accion.component';

describe('SeleccionarSedeAccionComponent', () => {
  let component: SeleccionarSedeAccionComponent;
  let fixture: ComponentFixture<SeleccionarSedeAccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarSedeAccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarSedeAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
