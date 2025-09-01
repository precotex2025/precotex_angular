import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionRollosFinalComponent } from './calificacion-rollos-final.component';

describe('CalificacionRollosFinalComponent', () => {
  let component: CalificacionRollosFinalComponent;
  let fixture: ComponentFixture<CalificacionRollosFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionRollosFinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionRollosFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
