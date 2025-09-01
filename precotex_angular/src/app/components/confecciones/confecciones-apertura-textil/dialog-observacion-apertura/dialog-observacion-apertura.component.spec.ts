import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObservacionAperturaComponent } from './dialog-observacion-apertura.component';

describe('DialogObservacionAperturaComponent', () => {
  let component: DialogObservacionAperturaComponent;
  let fixture: ComponentFixture<DialogObservacionAperturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogObservacionAperturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogObservacionAperturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
