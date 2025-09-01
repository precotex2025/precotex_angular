import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProduccionInspeccionSalidaCrearComponent } from './dialog-produccion-inspeccion-salida-crear.component';

describe('', () => {
  let component: DialogProduccionInspeccionSalidaCrearComponent;
  let fixture: ComponentFixture<DialogProduccionInspeccionSalidaCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProduccionInspeccionSalidaCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProduccionInspeccionSalidaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
