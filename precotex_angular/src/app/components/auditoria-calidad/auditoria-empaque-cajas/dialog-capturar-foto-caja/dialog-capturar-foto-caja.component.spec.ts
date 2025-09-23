import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCapturarFotoCajaComponent } from './dialog-capturar-foto-caja.component';

describe('DialogCapturarFotoCajaComponent', () => {
  let component: DialogCapturarFotoCajaComponent;
  let fixture: ComponentFixture<DialogCapturarFotoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCapturarFotoCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCapturarFotoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
