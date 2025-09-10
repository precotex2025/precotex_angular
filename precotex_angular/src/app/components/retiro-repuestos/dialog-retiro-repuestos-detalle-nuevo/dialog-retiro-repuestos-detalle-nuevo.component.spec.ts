import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRetiroRepuestosDetalleNuevoComponent } from './dialog-retiro-repuestos-detalle-nuevo.component';

describe('DialogRetiroRepuestosDetalleNuevoComponent', () => {
  let component: DialogRetiroRepuestosDetalleNuevoComponent;
  let fixture: ComponentFixture<DialogRetiroRepuestosDetalleNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRetiroRepuestosDetalleNuevoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRetiroRepuestosDetalleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
