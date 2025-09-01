import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComiteEmergenciaComponent } from './comite-emergencia.component';

describe('ComiteEmergenciaComponent', () => {
  let component: ComiteEmergenciaComponent;
  let fixture: ComponentFixture<ComiteEmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComiteEmergenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComiteEmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
