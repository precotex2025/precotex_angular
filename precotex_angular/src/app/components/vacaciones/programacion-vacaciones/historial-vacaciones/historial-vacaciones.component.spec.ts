import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialVacacionesComponent } from './historial-vacaciones.component';

describe('HistorialVacacionesComponent', () => {
  let component: HistorialVacacionesComponent;
  let fixture: ComponentFixture<HistorialVacacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialVacacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialVacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
