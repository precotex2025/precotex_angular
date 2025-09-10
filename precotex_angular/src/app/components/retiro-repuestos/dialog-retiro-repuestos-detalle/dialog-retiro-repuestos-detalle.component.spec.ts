import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRetiroRepuestosDetalleComponent } from './dialog-retiro-repuestos-detalle.component';

describe('DialogRetiroRepuestosDetalleComponent', () => {
  let component: DialogRetiroRepuestosDetalleComponent;
  let fixture: ComponentFixture<DialogRetiroRepuestosDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRetiroRepuestosDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRetiroRepuestosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
