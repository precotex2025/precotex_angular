import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearTrabajadorComponent } from './dialog-crear-trabajador.component';

describe('DialogCrearTrabajadorComponent', () => {
  let component: DialogCrearTrabajadorComponent;
  let fixture: ComponentFixture<DialogCrearTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCrearTrabajadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCrearTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
