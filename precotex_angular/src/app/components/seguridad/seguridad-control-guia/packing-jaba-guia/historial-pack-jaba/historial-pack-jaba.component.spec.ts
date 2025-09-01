import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPackJabaComponent } from './historial-pack-jaba.component';

describe('HistorialPackJabaComponent', () => {
  let component: HistorialPackJabaComponent;
  let fixture: ComponentFixture<HistorialPackJabaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialPackJabaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialPackJabaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
