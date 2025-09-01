import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenerarPaqueteComponent } from './dialog-generar-paquete.component';

describe('DialogGenerarPaqueteComponent', () => {
  let component: DialogGenerarPaqueteComponent;
  let fixture: ComponentFixture<DialogGenerarPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGenerarPaqueteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGenerarPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
