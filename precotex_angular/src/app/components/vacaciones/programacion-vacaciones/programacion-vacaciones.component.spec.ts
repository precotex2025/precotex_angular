import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionVacacionesComponent } from './programacion-vacaciones.component';

describe('ProgramacionVacacionesComponent', () => {
  let component: ProgramacionVacacionesComponent;
  let fixture: ComponentFixture<ProgramacionVacacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionVacacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionVacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
