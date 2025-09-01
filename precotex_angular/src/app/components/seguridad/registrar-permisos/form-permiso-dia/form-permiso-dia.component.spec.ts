import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPermisoDiaComponent } from './form-permiso-dia.component';

describe('FormPermisoDiaComponent', () => {
  let component: FormPermisoDiaComponent;
  let fixture: ComponentFixture<FormPermisoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPermisoDiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPermisoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
