import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMantenimientoComponent } from './dialog-mantenimiento.component';

describe('DialogMantenimientoComponent', () => {
  let component: DialogMantenimientoComponent;
  let fixture: ComponentFixture<DialogMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
