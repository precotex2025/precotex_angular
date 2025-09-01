import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCambioJabaComponent } from './dialog-cambio-jaba.component';

describe('DialogCambioJabaComponent', () => {
  let component: DialogCambioJabaComponent;
  let fixture: ComponentFixture<DialogCambioJabaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCambioJabaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCambioJabaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
