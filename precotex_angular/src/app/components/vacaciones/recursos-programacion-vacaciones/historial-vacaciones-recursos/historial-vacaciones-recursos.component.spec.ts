import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialVacacionesRecursosComponent } from './historial-vacaciones-recursos.component';

describe('HistorialVacacionesRecursosComponent', () => {
  let component: HistorialVacacionesRecursosComponent;
  let fixture: ComponentFixture<HistorialVacacionesRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialVacacionesRecursosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialVacacionesRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
