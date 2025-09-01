import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMiPermisoComponent } from './form-mi-permiso.component';

describe('FormMiPermisoComponent', () => {
  let component: FormMiPermisoComponent;
  let fixture: ComponentFixture<FormMiPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMiPermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMiPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
