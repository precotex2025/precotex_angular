import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTrabajadoresPermisosComponent } from './form-trabajadores-permisos.component';

describe('FormTrabajadoresPermisosComponent', () => {
  let component: FormTrabajadoresPermisosComponent;
  let fixture: ComponentFixture<FormTrabajadoresPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTrabajadoresPermisosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTrabajadoresPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
