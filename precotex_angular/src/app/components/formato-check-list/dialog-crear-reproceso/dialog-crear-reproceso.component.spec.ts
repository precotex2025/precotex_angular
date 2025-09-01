import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearReprocesoComponent } from './dialog-crear-reproceso.component';

describe('DialogCrearReprocesoComponent', () => {
  let component: DialogCrearReprocesoComponent;
  let fixture: ComponentFixture<DialogCrearReprocesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCrearReprocesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCrearReprocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
