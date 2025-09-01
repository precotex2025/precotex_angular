import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificacionRolloCalComponent } from './calificacion-rollo-cal.component';

describe('CalificacionRolloCalComponent', () => {
  let component: CalificacionRolloCalComponent;
  let fixture: ComponentFixture<CalificacionRolloCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificacionRolloCalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionRolloCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
