import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEvidenciaPackingCajaComponent } from './dialog-evidencia-packing-caja.component';

describe('DialogEvidenciaPackingCajaComponent', () => {
  let component: DialogEvidenciaPackingCajaComponent;
  let fixture: ComponentFixture<DialogEvidenciaPackingCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEvidenciaPackingCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEvidenciaPackingCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
