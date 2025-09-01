import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionRollosProcesoComponent } from './calificacion-rollos-proceso.component';

describe('CalificacionRollosProcesoComponent', () => {
  let component: CalificacionRollosProcesoComponent;
  let fixture: ComponentFixture<CalificacionRollosProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionRollosProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionRollosProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
