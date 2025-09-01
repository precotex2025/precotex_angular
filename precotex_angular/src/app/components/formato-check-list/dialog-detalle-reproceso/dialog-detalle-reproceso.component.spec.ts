import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleReprocesoComponent } from './dialog-detalle-reproceso.component';

describe('DialogDetalleReprocesoComponent', () => {
  let component: DialogDetalleReprocesoComponent;
  let fixture: ComponentFixture<DialogDetalleReprocesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleReprocesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleReprocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
