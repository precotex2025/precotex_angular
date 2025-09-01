import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObservacionesCorteComponent } from './dialog-observaciones-corte.component';

describe('DialogObservacionesCorteComponent', () => {
  let component: DialogObservacionesCorteComponent;
  let fixture: ComponentFixture<DialogObservacionesCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogObservacionesCorteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogObservacionesCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
