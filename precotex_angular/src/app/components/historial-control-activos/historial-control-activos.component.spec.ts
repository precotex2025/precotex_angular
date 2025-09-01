import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialControlActivosComponent } from './historial-control-activos.component';

describe('HistorialControlActivosComponent', () => {
  let component: HistorialControlActivosComponent;
  let fixture: ComponentFixture<HistorialControlActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialControlActivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialControlActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
