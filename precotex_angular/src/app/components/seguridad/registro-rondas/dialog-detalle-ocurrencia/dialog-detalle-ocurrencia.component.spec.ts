import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleOcurrenciaComponent } from './dialog-detalle-ocurrencia.component';

describe('DialogDetalleOcurrenciaComponent', () => {
  let component: DialogDetalleOcurrenciaComponent;
  let fixture: ComponentFixture<DialogDetalleOcurrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleOcurrenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleOcurrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
