import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaPermisosComponent } from './lectura-permisos.component';

describe('LecturaPermisosComponent', () => {
  let component: LecturaPermisosComponent;
  let fixture: ComponentFixture<LecturaPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaPermisosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
