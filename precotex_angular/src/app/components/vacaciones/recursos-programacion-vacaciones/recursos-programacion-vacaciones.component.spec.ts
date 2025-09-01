import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosProgramacionVacacionesComponent } from './recursos-programacion-vacaciones.component';

describe('RecursosProgramacionVacacionesComponent', () => {
  let component: RecursosProgramacionVacacionesComponent;
  let fixture: ComponentFixture<RecursosProgramacionVacacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosProgramacionVacacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosProgramacionVacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
