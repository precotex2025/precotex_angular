import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAprobacionPermisosComponent } from './form-aprobacion-permisos.component';

describe('FormAprobacionPermisosComponent', () => {
  let component: FormAprobacionPermisosComponent;
  let fixture: ComponentFixture<FormAprobacionPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAprobacionPermisosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAprobacionPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
